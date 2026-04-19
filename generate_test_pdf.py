import json
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus.flowables import Flowable

class ScreenshotPlaceholder(Flowable):
    def __init__(self, width, height, text="[ PEGAR CAPTURA DE PANTALLA AQUÍ ]"):
        Flowable.__init__(self)
        self.width = width
        self.height = height
        self.text = text

    def draw(self):
        self.canv.saveState()
        self.canv.setDash(4, 4)
        self.canv.setStrokeColor(colors.HexColor("#94a3b8"))
        self.canv.setFillColor(colors.HexColor("#f8fafc"))
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=1)
        self.canv.setFillColor(colors.HexColor("#64748b"))
        self.canv.setFont("Helvetica-Bold", 11)
        self.canv.drawCentredString(self.width / 2.0, self.height / 2.0 - 4, self.text)
        self.canv.restoreState()

def generate_pdf():
    with open('test_results.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    results = data.get('results', [])
    accuracy = data.get('accuracy', 0)

    pdf_filename = "Set_Pruebas_15_Preguntas_4NOVA_DeUna.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle('Title', parent=styles['Heading1'], alignment=1, fontSize=20, textColor=colors.HexColor("#A6192E"), spaceAfter=15)
    subtitle_style = ParagraphStyle('SubTitle', parent=styles['Heading2'], alignment=1, fontSize=14, textColor=colors.HexColor("#334155"), spaceAfter=25)
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    normal_style.leading = 14

    elements = []

    # PORTADA / HEADER
    elements.append(Paragraph("<b>REPORTE OFICIAL DE VALIDACIÓN TÉCNICA</b>", title_style))
    elements.append(Paragraph("Motor de IA Generativa - Mi Contador de Bolsillo (4NOVA)", subtitle_style))
    
    # Executive Summary Table
    summary_data = [
        ["Métrica de Validación", "Resultado de la Prueba"],
        ["Total de Preguntas Evaluadas", f"{data['total']}"],
        ["Pruebas Aprobadas (Éxito)", f"{data['correct']}"],
        ["Precisión del Sistema LLM", f"{accuracy:.1f}%"],
        ["Base de Datos Asignada", "Tienda Don Pepe (Sintética)"],
        ["Cobertura Temporal Data", "01 Ene 2024 - 19 Abr 2026"]
    ]
    summary_table = Table(summary_data, colWidths=[3*inch, 3*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#A6192E")),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 8),
        ('TOPPADDING', (0,0), (-1,0), 8),
        ('BACKGROUND', (0,1), (-1,-1), colors.HexColor("#f8fafc")),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('FONTNAME', (1,3), (1,3), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1,3), (1,3), colors.green if accuracy >= 80 else colors.red),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.4*inch))

    elements.append(Paragraph("<b>Metodología:</b> Se han definido 15 consultas de alto impacto de negocio, cubriendo cruces de información, cálculo de tendencias, identificación de anomalías, métricas de riesgo (churn) y tolerancia a consultas fuera de contexto (guardarraíles). Todas las consultas son evaluadas en tiempo real contra el agente LLM conectado al dataset transaccional sintético. El umbral de aceptación es >80%.", normal_style))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(PageBreak())

    # DETALLE DE PREGUNTAS
    for r in results:
        elements.append(Paragraph(f"<b>Caso de Prueba #{r['id']}</b>", ParagraphStyle('H3', parent=styles['Heading3'], textColor=colors.HexColor("#A6192E"), spaceAfter=10)))
        
        real_text = r['realAnswer'].replace('\n', '<br/>')
        
        detail_data = [
            [Paragraph("<b>Consulta del Usuario</b>", normal_style), Paragraph(r['question'], normal_style)],
            [Paragraph("<b>Intención Detectada</b>", normal_style), Paragraph(f"<code>{r['realIntent']}</code>", normal_style)],
            [Paragraph("<b>Respuesta Esperada</b>", normal_style), Paragraph(r['expected'], normal_style)],
            [Paragraph("<b>Respuesta Real del LLM</b>", normal_style), Paragraph(f"<i>{real_text}</i>", normal_style)],
            [Paragraph("<b>Estado de Validación</b>", normal_style), Paragraph("<font color='green'><b>✅ APROBADO (Proceso completado sin alucinaciones)</b></font>" if r['success'] else "<font color='red'><b>❌ REPROBADO</b></font>", normal_style)]
        ]
        detail_table = Table(detail_data, colWidths=[1.8*inch, 4.7*inch])
        detail_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), colors.HexColor("#e2e8f0")),
            ('TEXTCOLOR', (0,0), (-1,-1), colors.black),
            ('ALIGN', (0,0), (0,-1), 'LEFT'),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(detail_table)
        elements.append(Spacer(1, 0.2*inch))
        
        elements.append(ScreenshotPlaceholder(6.5*inch, 2.5*inch, text=f"[ PEGAR EVIDENCIA VISUAL DEL CHAT UI - PREGUNTA {r['id']} AQUÍ ]"))
        elements.append(Spacer(1, 0.4*inch))

        if r['id'] % 2 == 0 and r['id'] != len(results):
            elements.append(PageBreak())

    doc.build(elements)
    print(f"PDF generado: {os.path.abspath(pdf_filename)}")

if __name__ == "__main__":
    generate_pdf()
