import PyPDF2
try:
    reader = PyPDF2.PdfReader('Reto_IA_-_Deuna_-_I2H2026.pdf')
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    print(text)
except Exception as e:
    print(f"Error reading PDF: {e}")
