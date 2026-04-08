#!/usr/bin/env python3
"""Generate PDF from mvp-beta-fragen-antworten.md with full Cyrillic + German support."""

from fpdf import FPDF
import re

FONT = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"

class LegalPDF(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("AU", "", 8)
            self.set_text_color(140, 140, 140)
            self.cell(0, 8, "ReadyLegacy \u2014 MVP-Beta Transition: Antworten f\u00fcr Dr. Fanger | 10.04.2026", align="C")
            self.ln(6)

    def footer(self):
        self.set_y(-15)
        self.set_font("AU", "", 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 10, f"Seite {self.page_no()}/{{nb}}", align="C")


def clean(text):
    """Remove markdown formatting markers and replace emojis with text."""
    text = text.replace("**", "").replace("`", "")
    text = text.replace("\u274c", "[NEIN]")
    text = text.replace("\u2705", "[JA]")
    text = text.replace("\u26a0\ufe0f", "[!]")
    text = text.replace("\u26a0", "[!]")
    text = text.replace("\u2610", "[ ]")
    text = text.replace("\u2611", "[x]")
    return text


def build_pdf():
    pdf = LegalPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)

    pdf.add_font("AU", "", FONT)

    with open("/Users/viktorr/RiderProjects/ReadyLegacy/mvp-beta-fragen-antworten.md", "r") as f:
        content = f.read()

    lines = content.split("\n")
    pdf.add_page()
    pdf.set_left_margin(12)
    pdf.set_right_margin(12)

    i = 0
    in_code = False

    while i < len(lines):
        line = lines[i]

        # --- code fences ---
        if line.strip().startswith("```"):
            in_code = not in_code
            i += 1
            continue

        if in_code:
            pdf.set_font("AU", "", 7)
            pdf.set_text_color(60, 60, 60)
            pdf.set_fill_color(245, 245, 245)
            pdf.set_x(12)
            pdf.multi_cell(0, 3.8, line, fill=True)
            i += 1
            continue

        # --- empty line ---
        if not line.strip():
            pdf.ln(2)
            i += 1
            continue

        # --- H1 ---
        if line.startswith("# ") and not line.startswith("## "):
            pdf.set_font("AU", "", 17)
            pdf.set_text_color(25, 25, 25)
            pdf.set_x(12)
            pdf.multi_cell(0, 9, clean(line[2:]))
            pdf.ln(2)
            i += 1
            continue

        # --- H2 ---
        if line.startswith("## "):
            pdf.ln(4)
            pdf.set_draw_color(190, 160, 60)
            pdf.set_line_width(0.6)
            y = pdf.get_y()
            pdf.line(12, y, 198, y)
            pdf.ln(4)
            pdf.set_font("AU", "", 13)
            pdf.set_text_color(40, 40, 40)
            pdf.set_x(12)
            pdf.multi_cell(0, 7, clean(line[3:]))
            pdf.ln(2)
            i += 1
            continue

        # --- H3 ---
        if line.startswith("### "):
            pdf.ln(3)
            pdf.set_font("AU", "", 10.5)
            pdf.set_text_color(55, 55, 55)
            pdf.set_x(12)
            pdf.multi_cell(0, 5.5, clean(line[4:]))
            pdf.ln(1)
            i += 1
            continue

        # --- H4 ---
        if line.startswith("#### "):
            pdf.ln(2)
            pdf.set_font("AU", "", 9.5)
            pdf.set_text_color(30, 30, 120)
            pdf.set_x(12)
            pdf.multi_cell(0, 5, clean(line[5:]))
            pdf.ln(1)
            i += 1
            continue

        # --- horizontal rule ---
        if line.strip() == "---":
            pdf.ln(2)
            pdf.set_draw_color(200, 200, 200)
            pdf.set_line_width(0.3)
            y = pdf.get_y()
            pdf.line(12, y, 198, y)
            pdf.ln(3)
            i += 1
            continue

        # --- table rows ---
        if "|" in line and line.strip().startswith("|"):
            cells = [c.strip() for c in line.strip().split("|")[1:-1]]
            if cells and all(set(c) <= set("-: ") for c in cells):
                i += 1
                continue

            n_cols = len(cells)
            if n_cols == 0:
                i += 1
                continue

            col_w = 184 / n_cols
            pdf.set_font("AU", "", 7.5)
            pdf.set_text_color(30, 30, 30)
            pdf.set_x(12)
            for cell in cells:
                txt = clean(cell)
                if len(txt) > 60:
                    txt = txt[:57] + "..."
                pdf.cell(col_w, 5, txt, border=1)
            pdf.ln()
            i += 1
            continue

        # --- bullet points ---
        stripped = line.lstrip()
        if stripped.startswith("- ") or stripped.startswith("* "):
            indent = len(line) - len(stripped)
            text = clean(stripped[2:])
            pdf.set_font("AU", "", 9)
            pdf.set_text_color(30, 30, 30)
            x = min(16 + indent, 28)
            pdf.set_x(x)
            pdf.multi_cell(0, 4.8, "\u2022 " + text)
            i += 1
            continue

        # --- numbered list ---
        if re.match(r"^\s*\d+[\.\)]\s", line):
            text = clean(line.strip())
            pdf.set_font("AU", "", 9)
            pdf.set_text_color(30, 30, 30)
            pdf.set_x(16)
            pdf.multi_cell(0, 4.8, text)
            i += 1
            continue

        # --- regular paragraph ---
        text = clean(line.strip())
        if not text:
            pdf.ln(2)
            i += 1
            continue
        pdf.set_font("AU", "", 9)
        pdf.set_text_color(30, 30, 30)
        pdf.set_x(12)
        pdf.multi_cell(0, 4.8, text)
        i += 1

    out_path = "/Users/viktorr/RiderProjects/ReadyLegacy/mvp-beta-fragen-antworten.pdf"
    pdf.output(out_path)
    print(f"PDF created: {out_path}")
    print(f"Pages: {pdf.page_no()}")


if __name__ == "__main__":
    build_pdf()
