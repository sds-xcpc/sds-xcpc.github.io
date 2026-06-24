import argparse
import html
import io
import json
import re
import zipfile
from pathlib import Path


def esc(text: object) -> str:
    return html.escape(str(text), quote=False)


def replace_attr(fragment: str, name: str, value: str) -> str:
    if re.search(rf'\b{name}="[^"]*"', fragment):
        return re.sub(rf'\b{name}="[^"]*"', f'{name}="{value}"', fragment)
    return fragment.replace("<a:rPr", f'<a:rPr {name}="{value}"', 1)


def replace_xml_attr(fragment: str, tag_prefix: str, name: str, value: str) -> str:
    if re.search(rf'\b{name}="[^"]*"', fragment):
        return re.sub(rf'\b{name}="[^"]*"', f'{name}="{value}"', fragment)
    return fragment.replace(tag_prefix, f'{tag_prefix} {name}="{value}"', 1)


def with_font_size(fragment: str, size: str | None) -> str:
    if not size:
        return fragment
    return replace_attr(fragment, "sz", str(size))


def first_or_default(pattern: str, text: str, default: str = "") -> str:
    match = re.search(pattern, text, flags=re.DOTALL)
    return match.group(0) if match else default


def set_p_pr_child(p_pr: str, tag: str, child_xml: str) -> str:
    if not p_pr:
        p_pr = "<a:pPr/>"
    if p_pr.endswith("/>"):
        return p_pr[:-2] + f">{child_xml}</a:pPr>"
    p_pr = re.sub(rf"<a:{tag}\b[\s\S]*?</a:{tag}>", "", p_pr)
    return p_pr.replace("</a:pPr>", f"{child_xml}</a:pPr>", 1)


def styled_run_properties(r_pr: str, style: dict | None = None) -> str:
    style = style or {}
    if style.get("bold"):
        r_pr = replace_attr(r_pr, "b", "1")
    if style.get("fontFace"):
        font = esc(style["fontFace"])
        if r_pr.endswith("/>"):
            r_pr = r_pr[:-2] + f'><a:latin typeface="{font}"/><a:ea typeface="{font}"/></a:rPr>'
        elif "</a:rPr>" in r_pr:
            r_pr = r_pr.replace("</a:rPr>", f'<a:latin typeface="{font}"/><a:ea typeface="{font}"/></a:rPr>', 1)
    if style.get("color"):
        color = esc(style["color"])
        fill = f'<a:solidFill><a:srgbClr val="{color}"/></a:solidFill>'
        if r_pr.endswith("/>"):
            r_pr = r_pr[:-2] + f">{fill}</a:rPr>"
        else:
            r_pr = re.sub(r"<a:solidFill\b[\s\S]*?</a:solidFill>", "", r_pr)
            r_pr = r_pr.replace("</a:rPr>", f"{fill}</a:rPr>", 1)
    return r_pr


def styled_paragraph_properties(p_pr: str, style: dict | None = None) -> str:
    style = style or {}
    align = style.get("align")
    if align:
        if p_pr:
            p_pr = replace_xml_attr(p_pr, "<a:pPr", "algn", align)
        else:
            p_pr = f'<a:pPr algn="{align}"/>'
    if style.get("lineSpacingPct"):
        value = int(style["lineSpacingPct"])
        p_pr = set_p_pr_child(p_pr, "lnSpc", f'<a:lnSpc><a:spcPct val="{value}"/></a:lnSpc>')
    if style.get("spaceAfterPts") is not None:
        value = int(float(style["spaceAfterPts"]) * 100)
        p_pr = set_p_pr_child(p_pr, "spcAft", f'<a:spcAft><a:spcPts val="{value}"/></a:spcAft>')
    return p_pr


def make_paragraph(line: str, p_pr: str, r_pr: str) -> str:
    text = str(line)
    preserve = ' xml:space="preserve"' if text and (text[0].isspace() or text[-1].isspace()) else ""
    return f"<a:p>{p_pr}<a:r>{r_pr}<a:t{preserve}>{esc(text)}</a:t></a:r></a:p>"


def make_paragraphs(lines: list[str], template: str, font_size: str | None = None, style: dict | None = None) -> str:
    first_p = first_or_default(r"<a:p[\s\S]*?</a:p>", template, "<a:p></a:p>")
    p_pr = first_or_default(r"<a:pPr[\s\S]*?</a:pPr>", first_p)
    r_pr = first_or_default(r"<a:rPr[^>]*/>", first_p, '<a:rPr lang="zh-CN"/>')
    r_pr = with_font_size(r_pr, font_size)
    p_pr = styled_paragraph_properties(p_pr, style)
    r_pr = styled_run_properties(r_pr, style)

    expanded: list[str] = []
    for line in lines:
        expanded.extend(str(line).split("\n"))
    if not expanded:
        expanded = [""]

    return "".join(make_paragraph(line, p_pr, r_pr) for line in expanded)


def rewrite_tx_body(tx_body: str, lines: list[str], font_size: str | None = None, style: dict | None = None) -> str:
    prefix_match = re.match(r"(<p:txBody>[\s\S]*?<a:bodyPr[^>]*/>\s*(?:<a:lstStyle[^>]*/>\s*)?)", tx_body)
    suffix = "</p:txBody>"
    prefix = prefix_match.group(1) if prefix_match else "<p:txBody><a:bodyPr/><a:lstStyle/>"
    style = style or {}
    if style.get("anchor"):
        prefix = re.sub(
            r"<a:bodyPr\b[^>]*/>",
            lambda match: replace_xml_attr(match.group(0), "<a:bodyPr", "anchor", style["anchor"]),
            prefix,
            count=1,
        )
    return f"{prefix}{make_paragraphs(lines, tx_body, font_size, style)}{suffix}"


def set_shape_text(
    xml: str,
    shape_id: str,
    lines: list[str],
    font_size: str | None = None,
    style: dict | None = None,
) -> tuple[str, int]:
    pattern = re.compile(
        rf"(<p:sp\b(?:(?!</p:sp>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(shape_id))}\"[^>]*>[\s\S]*?</p:sp>)",
        re.DOTALL,
    )
    match = pattern.search(xml)
    if not match:
        return xml, 0

    shape = match.group(1)
    body_match = re.search(r"<p:txBody>[\s\S]*?</p:txBody>", shape)
    if not body_match:
        return xml, 0

    updated_body = rewrite_tx_body(body_match.group(0), lines, font_size, style)
    updated_shape = shape[: body_match.start()] + updated_body + shape[body_match.end() :]
    return xml[: match.start()] + updated_shape + xml[match.end() :], 1


def clone_shape(xml: str, source_id: str, target_id: str, name: str | None = None) -> tuple[str, int]:
    source_pattern = re.compile(
        rf"(<p:sp\b(?:(?!</p:sp>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(source_id))}\"[^>]*>[\s\S]*?</p:sp>)",
        re.DOTALL,
    )
    source_match = source_pattern.search(xml)
    if not source_match:
        return xml, 0

    if re.search(rf"<p:cNvPr\b[^>]*\bid=\"{re.escape(str(target_id))}\"", xml):
        return xml, 0

    cloned = source_match.group(1)

    def replace_cnvpr(match: re.Match[str]) -> str:
        fragment = replace_xml_attr(match.group(0), "<p:cNvPr", "id", str(target_id))
        if name:
            fragment = replace_xml_attr(fragment, "<p:cNvPr", "name", esc(name))
        return fragment

    cloned = re.sub(r"<p:cNvPr\b[^>]*/>", replace_cnvpr, cloned, count=1)
    return xml[: source_match.end()] + cloned + xml[source_match.end() :], 1


def set_all_run_sizes_in_shape(xml: str, shape_id: str, font_size: str) -> tuple[str, int]:
    pattern = re.compile(
        rf"(<p:sp\b(?:(?!</p:sp>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(shape_id))}\"[^>]*>[\s\S]*?</p:sp>)",
        re.DOTALL,
    )
    match = pattern.search(xml)
    if not match:
        return xml, 0
    shape = re.sub(r'(<a:rPr\b[^>]*?)\bsz="\d+"', rf'\1sz="{font_size}"', match.group(1))
    return xml[: match.start()] + shape + xml[match.end() :], 1


def set_object_geometry(xml: str, tag: str, object_id: str, geometry: dict) -> tuple[str, int]:
    pattern = re.compile(
        rf"(<{tag}\b(?:(?!</{tag}>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(object_id))}\"[^>]*>[\s\S]*?</{tag}>)",
        re.DOTALL,
    )
    match = pattern.search(xml)
    if not match:
        return xml, 0

    block = match.group(1)
    if geometry.get("resetTransform"):
        block = re.sub(r'(<a:xfrm\b[^>]*)\s(?:rot|flipH|flipV)="[^"]*"', r"\1", block)
        block = re.sub(r'(<a:xfrm\b[^>]*)\s(?:rot|flipH|flipV)="[^"]*"', r"\1", block)
        block = re.sub(r'(<a:xfrm\b[^>]*)\s(?:rot|flipH|flipV)="[^"]*"', r"\1", block)

    def update_off(off_match: re.Match[str]) -> str:
        x = str(geometry.get("x", off_match.group(1)))
        y = str(geometry.get("y", off_match.group(2)))
        return f'<a:off x="{x}" y="{y}"'

    def update_ext(ext_match: re.Match[str]) -> str:
        cx = str(geometry.get("cx", ext_match.group(1)))
        cy = str(geometry.get("cy", ext_match.group(2)))
        return f'<a:ext cx="{cx}" cy="{cy}"'

    block = re.sub(r'<a:off x="([^"]+)" y="([^"]+)"', update_off, block, count=1)
    block = re.sub(r'<a:ext cx="([^"]+)" cy="([^"]+)"', update_ext, block, count=1)
    return xml[: match.start()] + block + xml[match.end() :], 1


def set_shape_style(xml: str, shape_id: str, style: dict) -> tuple[str, int]:
    pattern = re.compile(
        rf"(<p:sp\b(?:(?!</p:sp>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(shape_id))}\"[^>]*>[\s\S]*?</p:sp>)",
        re.DOTALL,
    )
    match = pattern.search(xml)
    if not match:
        return xml, 0

    shape = match.group(1)
    sppr_match = re.search(r"<p:spPr\b[^>]*>[\s\S]*?</p:spPr>", shape)
    if not sppr_match:
        return xml, 0

    sppr = sppr_match.group(0)
    fill = style.get("fill")
    line = style.get("line")

    if fill:
        fill_xml = f'<a:solidFill><a:srgbClr val="{fill}"/></a:solidFill>'
        sppr = re.sub(r"<a:noFill\s*/>", "", sppr)
        sppr = re.sub(r"<a:solidFill\b[\s\S]*?</a:solidFill>", "", sppr)
        sppr = re.sub(r"<a:gradFill\b[\s\S]*?</a:gradFill>", "", sppr)
        sppr = re.sub(r"<a:blipFill\b[\s\S]*?</a:blipFill>", "", sppr)
        sppr = re.sub(r"<a:pattFill\b[\s\S]*?</a:pattFill>", "", sppr)
        line_pos = sppr.find("<a:ln")
        if line_pos >= 0:
            sppr = sppr[:line_pos] + fill_xml + sppr[line_pos:]
        else:
            sppr = sppr.replace("</p:spPr>", f"{fill_xml}</p:spPr>")

    if line:
        width = str(style.get("lineWidth", 9525))
        line_xml = f'<a:ln w="{width}"><a:solidFill><a:srgbClr val="{line}"/></a:solidFill></a:ln>'
        if re.search(r"<a:ln\b[\s\S]*?</a:ln>", sppr):
            sppr = re.sub(r"<a:ln\b[\s\S]*?</a:ln>", line_xml, sppr, count=1)
        else:
            sppr = sppr.replace("</p:spPr>", f"{line_xml}</p:spPr>")

    updated_shape = shape[: sppr_match.start()] + sppr + shape[sppr_match.end() :]
    return xml[: match.start()] + updated_shape + xml[match.end() :], 1


def next_relationship_id(rels_xml: str) -> str:
    used = [int(item) for item in re.findall(r'Id="rId(\d+)"', rels_xml)]
    return f"rId{max(used or [0]) + 1}"


def image_bytes_for_embed(source: Path, crop_aspect: float | None = None, focus_y: float = 0.45) -> bytes:
    raw = source.read_bytes()
    if not crop_aspect:
        return raw

    try:
        from PIL import Image
    except ImportError:
        return raw

    with Image.open(io.BytesIO(raw)) as image:
        image = image.convert("RGB")
        width, height = image.size
        target = float(crop_aspect)
        current = width / height

        if current > target:
            new_width = int(height * target)
            left = max(0, (width - new_width) // 2)
            box = (left, 0, left + new_width, height)
        else:
            new_height = int(width / target)
            top = max(0, min(height - new_height, int((height - new_height) * focus_y)))
            box = (0, top, width, top + new_height)

        cropped = image.crop(box)
        output = io.BytesIO()
        cropped.save(output, format="JPEG", quality=94, optimize=True)
        return output.getvalue()


def ensure_image_content_type(files: dict[str, bytes], suffix: str) -> None:
    extension = suffix.lower().lstrip(".")
    content_type = {
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "png": "image/png",
        "webp": "image/webp",
    }.get(extension)
    if not content_type:
        return

    content_types = files["[Content_Types].xml"].decode("utf-8")
    if f'Extension="{extension}"' not in content_types:
        default = f'<Default Extension="{extension}" ContentType="{content_type}"/>'
        content_types = content_types.replace("</Types>", f"{default}</Types>")
        files["[Content_Types].xml"] = content_types.encode("utf-8")


def logo_bytes_on_original_canvas(
    original: bytes,
    source: Path,
    max_width_fraction: float = 0.78,
    max_height_fraction: float = 0.8,
    align: str = "center",
) -> bytes:
    try:
        from PIL import Image
    except ImportError:
        return source.read_bytes()

    with Image.open(io.BytesIO(original)) as base_image, Image.open(source) as logo_image:
        width, height = base_image.size
        logo = logo_image.convert("RGBA")
        max_width = max(1, int(width * max_width_fraction))
        max_height = max(1, int(height * max_height_fraction))
        logo.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

        canvas = Image.new("RGBA", (width, height), (255, 255, 255, 0))
        if align == "left":
            x = 0
        elif align == "right":
            x = width - logo.width
        else:
            x = (width - logo.width) // 2
        y = (height - logo.height) // 2
        canvas.alpha_composite(logo, (x, y))

        output = io.BytesIO()
        canvas.save(output, format="PNG")
        return output.getvalue()


def transparent_png_like(original: bytes) -> bytes:
    try:
        from PIL import Image
    except ImportError:
        return b""

    with Image.open(io.BytesIO(original)) as base_image:
        canvas = Image.new("RGBA", base_image.size, (255, 255, 255, 0))
        output = io.BytesIO()
        canvas.save(output, format="PNG")
        return output.getvalue()


def clear_regions_png(original: bytes, regions: list[dict]) -> bytes:
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return original

    with Image.open(io.BytesIO(original)) as image:
        canvas = image.convert("RGBA")
        draw = ImageDraw.Draw(canvas)
        for region in regions:
            x = int(region["x"])
            y = int(region["y"])
            w = int(region["w"])
            h = int(region["h"])
            sample_x = max(0, min(canvas.width - 1, int(region.get("sampleX", x))))
            sample_y = max(0, min(canvas.height - 1, int(region.get("sampleY", y))))
            fill = tuple(canvas.getpixel((sample_x, sample_y)))
            if region.get("fill"):
                raw = str(region["fill"]).lstrip("#")
                fill = tuple(int(raw[i : i + 2], 16) for i in (0, 2, 4)) + (255,)
            draw.rectangle((x, y, x + w, y + h), fill=fill)

        output = io.BytesIO()
        canvas.save(output, format="PNG")
        return output.getvalue()


def apply_media_replacements(files: dict[str, bytes], replacements: list[dict]) -> int:
    count = 0
    for item in replacements:
        media_part = item["mediaPart"]
        if media_part not in files:
            continue
        if item.get("mode") == "transparent":
            files[media_part] = transparent_png_like(files[media_part])
        elif item.get("mode") == "clearRegions":
            files[media_part] = clear_regions_png(files[media_part], item.get("regions", []))
        elif item.get("mode") == "direct":
            source = Path(item["imagePath"])
            if not source.exists():
                continue
            files[media_part] = source.read_bytes()
        else:
            source = Path(item["imagePath"])
            if not source.exists():
                continue
            files[media_part] = logo_bytes_on_original_canvas(
                files[media_part],
                source,
                float(item.get("maxWidthFraction", 0.78)),
                float(item.get("maxHeightFraction", 0.8)),
                item.get("align", "center"),
            )
        count += 1
    return count


def replace_picture_image(
    files: dict[str, bytes],
    slide_part: str,
    xml: str,
    pic_id: str,
    image_path: str,
    media_name: str,
    clear_crop: bool = False,
    crop_aspect: float | None = None,
    crop_focus_y: float = 0.45,
) -> tuple[str, int]:
    source = Path(image_path)
    if not source.exists():
        return xml, 0

    rels_part = slide_part.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
    if rels_part not in files:
        return xml, 0

    media_part = f"ppt/media/{media_name}"
    files[media_part] = image_bytes_for_embed(source, crop_aspect, crop_focus_y)
    ensure_image_content_type(files, Path(media_name).suffix or source.suffix)

    rels_xml = files[rels_part].decode("utf-8")
    target = f"../media/{media_name}"
    existing = re.search(rf'<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="{re.escape(target)}"', rels_xml)
    if existing:
        rid = existing.group(1)
    else:
        rid = next_relationship_id(rels_xml)
        rel = (
            f'<Relationship Id="{rid}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
            f'Target="{target}"/>'
        )
        rels_xml = rels_xml.replace("</Relationships>", f"{rel}</Relationships>")
        files[rels_part] = rels_xml.encode("utf-8")

    pattern = re.compile(
        rf"(<p:pic\b(?:(?!</p:pic>).)*?<p:cNvPr\b[^>]*\bid=\"{re.escape(str(pic_id))}\"[^>]*>[\s\S]*?</p:pic>)",
        re.DOTALL,
    )
    match = pattern.search(xml)
    if not match:
        return xml, 0

    block = match.group(1)
    if re.search(r"<a:blip\b[^>]*\br:embed=", block):
        block = re.sub(r'r:embed="[^"]+"', f'r:embed="{rid}"', block, count=1)
    else:
        block = re.sub(
            r"<p:blipFill>[\s\S]*?</p:blipFill>",
            f'<p:blipFill><a:blip r:embed="{rid}" cstate="print"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>',
            block,
            count=1,
        )
    if clear_crop:
        block = re.sub(r"<a:srcRect\b[^>]*/>", "", block)
    return xml[: match.start()] + block + xml[match.end() :], 1


def apply_picture_images(files: dict[str, bytes], slide_part: str, xml: str, plan: dict) -> tuple[str, int]:
    count = 0
    for item in plan.get("pictureImages", []):
        xml, c = replace_picture_image(
            files,
            slide_part,
            xml,
            str(item["picId"]),
            item["imagePath"],
            item["mediaName"],
            bool(item.get("clearCrop")),
            float(item["cropAspect"]) if item.get("cropAspect") else None,
            float(item.get("cropFocusY", 0.45)),
        )
        count += c
    return xml, count


def replace_text_nodes(xml: str, rules: list[dict]) -> tuple[str, int]:
    count = 0

    def rewrite(match: re.Match[str]) -> str:
        nonlocal count
        attrs = match.group(1) or ""
        raw_text = match.group(2)
        text = html.unescape(raw_text)
        replacement = None

        for rule in rules:
            if rule.get("type") == "exact" and text == rule["from"]:
                replacement = rule["to"]
                break
            if rule.get("type") == "contains" and rule["from"] in text:
                replacement = rule["to"]
                break

        if replacement is None:
            return match.group(0)

        count += 1
        if replacement == "":
            return f"<a:t{attrs}></a:t>"
        return f"<a:t{attrs}>{esc(replacement)}</a:t>"

    updated = re.sub(r"<a:t([^>]*)>(.*?)</a:t>", rewrite, xml, flags=re.DOTALL)
    return updated, count


def set_cell_text(cell: str, text: str, font_size: str | None = None) -> str:
    body_match = re.search(r"<a:txBody>[\s\S]*?</a:txBody>", cell)
    if not body_match:
        return cell

    tx_body = body_match.group(0)
    prefix_match = re.match(r"(<a:txBody>[\s\S]*?<a:bodyPr[^>]*/>\s*(?:<a:lstStyle[^>]*/>\s*)?)", tx_body)
    prefix = prefix_match.group(1) if prefix_match else "<a:txBody><a:bodyPr/><a:lstStyle/>"
    first_p = first_or_default(r"<a:p[\s\S]*?</a:p>", tx_body, "<a:p></a:p>")
    p_pr = first_or_default(r"<a:pPr[\s\S]*?</a:pPr>", first_p)
    r_pr = first_or_default(r"<a:rPr[^>]*/>", first_p, '<a:rPr lang="zh-CN"/>')
    r_pr = with_font_size(r_pr, font_size)
    new_body = f"{prefix}{make_paragraph(str(text), p_pr, r_pr)}</a:txBody>"
    return cell[: body_match.start()] + new_body + cell[body_match.end() :]


def set_table_rows(xml: str, table_index: int, rows: list[list[str]], font_size: str | None = None) -> tuple[str, int]:
    tables = list(re.finditer(r"<a:tbl[\s\S]*?</a:tbl>", xml))
    if table_index >= len(tables):
        return xml, 0

    match = tables[table_index]
    table = match.group(0)
    row_matches = list(re.finditer(r"<a:tr[\s\S]*?</a:tr>", table))
    if len(row_matches) < 2:
        return xml, 0

    header_template = row_matches[0].group(0)
    data_template = row_matches[1].group(0)

    def fill_row(template: str, values: list[str]) -> str:
        cells = list(re.finditer(r"<a:tc[\s\S]*?</a:tc>", template))
        out = []
        last = 0
        for idx, cell_match in enumerate(cells):
            out.append(template[last : cell_match.start()])
            value = values[idx] if idx < len(values) else ""
            out.append(set_cell_text(cell_match.group(0), value, font_size if template != header_template else None))
            last = cell_match.end()
        out.append(template[last:])
        return "".join(out)

    new_rows = [fill_row(header_template, rows[0])]
    for row in rows[1:]:
        new_rows.append(fill_row(data_template, row))

    new_table = table[: row_matches[0].start()] + "".join(new_rows) + table[row_matches[-1].end() :]
    return xml[: match.start()] + new_table + xml[match.end() :], 1


def apply_part_plan(xml: str, plan: dict) -> tuple[str, int]:
    count = 0

    if plan.get("replaceText"):
        xml, c = replace_text_nodes(xml, plan["replaceText"])
        count += c

    for item in plan.get("shapeClones", []):
        xml, c = clone_shape(xml, str(item["sourceShapeId"]), str(item["targetShapeId"]), item.get("name"))
        count += c

    for item in plan.get("shapeText", []):
        xml, c = set_shape_text(
            xml,
            str(item["shapeId"]),
            item.get("lines", []),
            item.get("fontSize"),
            item.get("textStyle"),
        )
        count += c

    for item in plan.get("shapeFontSize", []):
        xml, c = set_all_run_sizes_in_shape(xml, str(item["shapeId"]), str(item["fontSize"]))
        count += c

    for item in plan.get("shapeGeometry", []):
        xml, c = set_object_geometry(xml, "p:sp", str(item["shapeId"]), item)
        count += c

    for item in plan.get("shapeStyle", []):
        xml, c = set_shape_style(xml, str(item["shapeId"]), item)
        count += c

    for item in plan.get("pictureGeometry", []):
        xml, c = set_object_geometry(xml, "p:pic", str(item["picId"]), item)
        count += c

    for item in plan.get("groupGeometry", []):
        xml, c = set_object_geometry(xml, "p:grpSp", str(item["groupId"]), item)
        count += c

    for item in plan.get("tables", []):
        xml, c = set_table_rows(xml, int(item.get("tableIndex", 0)), item["rows"], item.get("fontSize"))
        count += c

    return xml, count


def media_targets_for_slide(files: dict[str, bytes], slide_part: str) -> dict[str, str]:
    rels_part = slide_part.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
    if rels_part not in files:
        return {}

    rels_xml = files[rels_part].decode("utf-8")
    targets: dict[str, str] = {}
    for match in re.finditer(r'<Relationship\b[^>]*Id="([^"]+)"[^>]*Target="\.\./media/([^"]+)"', rels_xml):
        targets[match.group(1)] = f"ppt/media/{match.group(2)}"
    return targets


def picture_media_part(pic_xml: str, targets: dict[str, str]) -> str | None:
    match = re.search(r'r:embed="([^"]+)"', pic_xml)
    if not match:
        return None
    return targets.get(match.group(1))


def apply_global_picture_geometry(files: dict[str, bytes], rules: list[dict]) -> int:
    if not rules:
        return 0

    count = 0
    slide_parts = sorted(
        [name for name in files if re.match(r"ppt/slides/slide\d+\.xml$", name)],
        key=lambda item: int(re.search(r"slide(\d+)\.xml$", item).group(1)),
    )

    for slide_part in slide_parts:
        xml = files[slide_part].decode("utf-8")
        slide_no = int(re.search(r"slide(\d+)\.xml$", slide_part).group(1))
        targets = media_targets_for_slide(files, slide_part)
        for rule in rules:
            media_part = rule["mediaPart"]
            geometry = dict(rule)
            page_by_slide = rule.get("pageBySlide") or {}
            page_no = page_by_slide.get(str(slide_no)) or page_by_slide.get(slide_no)
            if page_no is not None:
                side = "left" if int(page_no) % 2 else "right"
                geometry.update(rule.get(side, {}))

            def update_pic(match: re.Match[str]) -> str:
                nonlocal count
                pic_xml = match.group(1)
                if picture_media_part(pic_xml, targets) != media_part:
                    return pic_xml

                count += 1

                def update_off(off_match: re.Match[str]) -> str:
                    return f'<a:off x="{geometry.get("x", off_match.group(1))}" y="{geometry.get("y", off_match.group(2))}"'

                def update_ext(ext_match: re.Match[str]) -> str:
                    return f'<a:ext cx="{geometry.get("cx", ext_match.group(1))}" cy="{geometry.get("cy", ext_match.group(2))}"'

                updated = re.sub(r'<a:off x="([^"]+)" y="([^"]+)"', update_off, pic_xml, count=1)
                updated = re.sub(r'<a:ext cx="([^"]+)" cy="([^"]+)"', update_ext, updated, count=1)
                if geometry.get("clearCrop"):
                    updated = re.sub(r"<a:srcRect\b[^>]*/>", "", updated)
                return updated

            xml = re.sub(r"(<p:pic\b[\s\S]*?</p:pic>)", update_pic, xml)
        files[slide_part] = xml.encode("utf-8")
    return count


def rel_target_for_slide(slide_no: int) -> str:
    return f"slides/slide{slide_no}.xml"


def add_slide_clone(files: dict[str, bytes], clone: dict, used_slide_ids: set[int]) -> str:
    source_no = int(clone["sourceSlide"])
    insert_after_no = int(clone.get("insertAfterSlide", source_no))
    target_no = int(clone["targetSlide"])
    source_part = f"ppt/slides/slide{source_no}.xml"
    target_part = f"ppt/slides/slide{target_no}.xml"
    source_rels = f"ppt/slides/_rels/slide{source_no}.xml.rels"
    target_rels = f"ppt/slides/_rels/slide{target_no}.xml.rels"

    files[target_part] = files[source_part]
    if source_rels in files:
        rels_xml = files[source_rels].decode("utf-8")
        rels_xml = re.sub(
            r'<Relationship\b[^>]*Type="http://schemas\.openxmlformats\.org/officeDocument/2006/relationships/notesSlide"[^>]*/>',
            "",
            rels_xml,
        )
        files[target_rels] = rels_xml.encode("utf-8")

    content_types = files["[Content_Types].xml"].decode("utf-8")
    override = (
        f'<Override PartName="/{target_part}" '
        'ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'
    )
    if f'PartName="/{target_part}"' not in content_types:
        content_types = content_types.replace("</Types>", f"{override}</Types>")
    files["[Content_Types].xml"] = content_types.encode("utf-8")

    rels = files["ppt/_rels/presentation.xml.rels"].decode("utf-8")
    used_rids = [int(item) for item in re.findall(r'Id="rId(\d+)"', rels)]
    new_rid = f"rId{max(used_rids) + 1}"
    relationship = (
        f'<Relationship Id="{new_rid}" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" '
        f'Target="{rel_target_for_slide(target_no)}"/>'
    )
    rels = rels.replace("</Relationships>", f"{relationship}</Relationships>")
    files["ppt/_rels/presentation.xml.rels"] = rels.encode("utf-8")

    insert_after_rid_match = re.search(
        rf'<Relationship[^>]*Id="([^"]+)"[^>]*Target="{re.escape(rel_target_for_slide(insert_after_no))}"',
        rels,
    )
    if not insert_after_rid_match:
        raise RuntimeError(f"Could not find presentation relationship for slide {insert_after_no}")
    insert_after_rid = insert_after_rid_match.group(1)

    presentation = files["ppt/presentation.xml"].decode("utf-8")
    existing_ids = [int(item) for item in re.findall(r'<p:sldId[^>]*\bid="(\d+)"', presentation)]
    new_slide_id = max(max(existing_ids), max(used_slide_ids or {0})) + 1
    used_slide_ids.add(new_slide_id)
    slide_id_xml = f'<p:sldId id="{new_slide_id}" r:id="{new_rid}"/>'

    insert_after_sld = re.search(rf'<p:sldId[^>]*r:id="{re.escape(insert_after_rid)}"[^>]*/>', presentation)
    if not insert_after_sld:
        raise RuntimeError(f"Could not find slide id entry for {insert_after_rid}")
    presentation = presentation[: insert_after_sld.end()] + slide_id_xml + presentation[insert_after_sld.end() :]
    files["ppt/presentation.xml"] = presentation.encode("utf-8")

    return target_part


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--template", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--plan", required=True)
    args = parser.parse_args()

    template = Path(args.template)
    output = Path(args.output)
    plan = json.loads(Path(args.plan).read_text(encoding="utf-8"))
    parts = plan["parts"]

    output.parent.mkdir(parents=True, exist_ok=True)
    total = 0

    with zipfile.ZipFile(template, "r") as src:
        ordered_names = [item.filename for item in src.infolist()]
        files = {item.filename: src.read(item.filename) for item in src.infolist()}

    used_slide_ids: set[int] = set()
    for clone in plan.get("clones", []):
        target_part = add_slide_clone(files, clone, used_slide_ids)
        ordered_names.append(target_part)
        target_rels = target_part.replace("ppt/slides/", "ppt/slides/_rels/") + ".rels"
        if target_rels in files and target_rels not in ordered_names:
            ordered_names.append(target_rels)
        if clone.get("part"):
            parts[target_part] = clone["part"]

    total += apply_media_replacements(files, plan.get("mediaReplacements", []))
    total += apply_global_picture_geometry(files, plan.get("globalPictureGeometry", []))

    for name, part_plan in parts.items():
        if name not in files:
            continue
        xml = files[name].decode("utf-8")
        xml, count = apply_part_plan(xml, part_plan)
        xml, image_count = apply_picture_images(files, name, xml, part_plan)
        files[name] = xml.encode("utf-8")
        total += count + image_count

    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as dst:
        written: set[str] = set()
        for name in ordered_names:
            if name in files and name not in written:
                dst.writestr(name, files[name])
                written.add(name)
        for name, data in files.items():
            if name not in written:
                dst.writestr(name, data)
                written.add(name)

    print(f"Updated {total} brochure blocks -> {output}")


if __name__ == "__main__":
    main()
