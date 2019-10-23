# from urllib.parse import urlparse
from PyPDF2 import PdfFileMerger
from urllib import parse
import os
import sys
import requests

cookies = {'JSESSIONID': 'E13AB83CB7D69C43C3083A6565617AEE',
           'ezproxy': 'z8wprER67biu2Pi'}
pages = ["http://bv.unir.net:2116/ib/IB_Browser?pagina=2&libro=4143&id=3e5cbbc2ceb2010b122ad0cd9aff027da205b8cd"]


def downloadFile(url, downloadDir, fileName):
    print(downloadDir)
    print(fileName)

    pathUnion = os.path.join(downloadDir, fileName + '.pdf')
    # pathUnion = "" + downloadDir + fileName + ".pdf"
    print(pathUnion)
    if not os.path.exists(downloadDir):
        os.makedirs(downloadDir)
    with open(pathUnion, "wb") as file:
        response = requests.get(url, cookies=cookies)
        # print(response.content)
        file.write(response.content)


# Path donde se encuentra el ficher
scriptPath = sys.path[0]

# Un directorio mas atras crea la carpeta UnirLibrary + Book ID
bookId = parse.parse_qs(parse.urlparse(pages[0]).query)['libro'][0]
downloadPath = os.path.join(scriptPath, 'UnirLibrary')
downloadPath = os.path.join(downloadPath, bookId)

# url = sys.argv[1]
# http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&ultpag=1&id=0c386e54d9c67029abf71181e4bfd3b22f2e13cd
# fileName = sys.argv[2]
# el fileName sera el numero de pagina
print('path of the script: ' + scriptPath)
print('downloading file to: ' + downloadPath)


for page in pages:
    pageNumer = parse.parse_qs(parse.urlparse(page).query)['pagina'][0]
    downloadFile(page, downloadPath, pageNumer)
    print('Current page Number:' + pageNumer)
    print('Current page URL:' + page)

print("Agur eta jan Yogur!")


pdfs = [archivo for archivo in os.listdir(
    downloadPath) if archivo.endswith(".pdf")]
nombre_archivo_salida = bookId + ".pdf"
fusionador = PdfFileMerger()

for pdf in pdfs:
    fusionador.append(open(pdf, 'rb'))

with open(nombre_archivo_salida, 'wb') as salida:
    fusionador.write(salida)
# downloadFile(url, downloadPath + fileName)
# print('file downloaded...')
# print('exiting program...')
