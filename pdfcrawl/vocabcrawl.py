import PyPDF2
import re

# Function to extract English words, parts of speech, and Chinese translations from the PDF
def extract_vocabulary_info(pdf_file_path, output_file_path):
    english_words = []
    parts_of_speech = []
    chinese_translations = []

    try:
        # Open the PDF file in binary read mode
        with open(pdf_file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)

            # Iterate through each page of the PDF
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()

                # Use regular expressions to extract information
                entries = re.findall(r'(\w+)\s+([A-Za-z]+)\.\s+([\u4e00-\u9fa5]+)', page_text)

                for entry in entries:
                    english, pos, chinese = entry
                    english_words.append(english)
                    parts_of_speech.append(pos)
                    chinese_translations.append(chinese)

        # Save English words to a text file
        with open(output_file_path, "w") as output_file:
            for word in english_words:
                output_file.write(word + "\n")

        print(f"English words saved to {output_file_path}")

        return english_words, parts_of_speech, chinese_translations

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return [], [], []

# Specify the path to your PDF file
pdf_file_path = '7000vocab.pdf'

# Extract vocabulary information
english_words, parts_of_speech, chinese_translations = extract_vocabulary_info(pdf_file_path, "7000vocab.txt")

# Print the extracted information (you can save it to a file, database, etc., as needed)
for english, pos, chinese in zip(english_words, parts_of_speech, chinese_translations):
    print(f"English: {english}, Part of Speech: {pos}, Chinese: {chinese}")
