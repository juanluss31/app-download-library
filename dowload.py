# from urllib.parse import urlparse
from PyPDF2 import PdfFileMerger
from urllib import parse
import os
import sys
import requests

cookies = {'JSESSIONID': 'E13AB83CB7D69C43C3083A6565617AEE',
           'ezproxy': 'z8wprER67biu2Pi'}
pages = ['http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=0107f156dbb87f16be816b7acdd34a08f0a90a68', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=2&libro=4143&id=3e5cbbc2ceb2010b122ad0cd9aff027da205b8cd', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=3&libro=4143&id=c400be4b24c0c3fefefcef217258b515aa151869', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=4&libro=4143&id=2e85bb57c805c916619370a62bc900e0a98426d1', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=5&libro=4143&id=bec4c1d36a25872b293efb8e1390ab636eae878a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=6&libro=4143&id=d60df01b5691007945df600e90e60cbd18e8737a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=7&libro=4143&id=3c7bb21be771acf4c3423b5c15980fda5d689737', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=8&libro=4143&id=0d688a21bcacc47fc7ff1a318c387ceaf11d3c60', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=9&libro=4143&id=1e70f9728c1abe8ad3c72b5ead34bd4ae5371fb4', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=10&libro=4143&id=b4f7f46bfd0d738757da81bb676a9e9d3f245841', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=11&libro=4143&id=02e6048d0f687600c7992462d77aca900e6e30e7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=12&libro=4143&id=7bf3a1036712117b1fd05136079c29add4e44169', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=13&libro=4143&id=9ce8a386cd76ebbb6cf45ba758dbc242855c36d4', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=14&libro=4143&id=63f4e846936b4de26f11ccc1ecdda9e20e83a8a7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=15&libro=4143&id=03046f34c8f50b80017f8ac004f985ee2f9e473d', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=16&libro=4143&id=9a83860b594e3aebcd201bb08b7b8c8e94447e2f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=17&libro=4143&id=3790cd271f9c67d6298108ab2370f8e2b6b80e85', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=18&libro=4143&id=7ba1f99cb9c891519c8608edfea0386d64bad07f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=19&libro=4143&id=0f85e9168b2807098d41b69e6bbb8ae5318e0b96', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=20&libro=4143&id=a9a8867f829957e1474ee7293a496ddd4086d27b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=21&libro=4143&id=7b40f13c690af5454735ab402745ced98a86e4e6', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=22&libro=4143&id=724c8f1db4ac08a7ed41cf59746b09b93e756fd7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=23&libro=4143&id=2a6c98cfb9105b89f57d8854ee20940b5ad29a6b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=24&libro=4143&id=00ef0cfe6b16303eb8b58eecffd372eb29069c79', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=25&libro=4143&id=1bdfcab91a2188184b32735da61c9e8d157d94e0',
         'http://bv.unir.net:2116/ib/IB_Browser?pagina=26&libro=4143&id=a7f2f6cbc85fd29fb5bcde1682b035c3827ed363', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=27&libro=4143&id=c3adc6036aae071fe162163e559ec296118f2ef6', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=28&libro=4143&id=07ce868dbd105ea342a9ac4e6c0e2c7d07fc50e6', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=29&libro=4143&id=e8d30db5590e4f03e9582b1c5fee6d12b97af90b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=30&libro=4143&id=809c6898220af33ccac5143399113cf5a1ea6038', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=31&libro=4143&id=b7dd6c101673dc3133a8eb27af8f113fbf9bff8c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=32&libro=4143&id=cf34b7f5b4daedc1a6adaa39c1daf8606bc639e5', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=33&libro=4143&id=98a82c56dc33fc2b8472330525718c719aca820f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=34&libro=4143&id=e090b3f5e3611dbed65c1b2e100df10de46485b3', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=35&libro=4143&id=9a2bb293bbfed2edf2efdafa1eaa88eb4bff772e', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=36&libro=4143&id=58ec9371bc2d6333120a4a7c7d1b55f71211a143', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=37&libro=4143&id=2c92c17df5c4c90d681697a006790aab6c75fbdf', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=38&libro=4143&id=175a23513d30f09156f45ad9c57c0ae2f3a95a35', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=39&libro=4143&id=05bf1233f564231bace1309f47d6e61700ba546f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=40&libro=4143&id=308767fa8b14dc0493ef1f7c2f8a9a3188bc9d5b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=41&libro=4143&id=10c561a83ecd9328871903fe732d8b747253d879', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=42&libro=4143&id=31edbea653ac0743e7456cc1491acfabaebba19c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=43&libro=4143&id=072ead54614127697880817d93bf684ba8a2ca0c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=44&libro=4143&id=677092644df08781fcc1b388700576ed5da5ecc3', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=45&libro=4143&id=fca707bc43693bcb809ef6d55b6afb5f0c960d1f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=46&libro=4143&id=b896d68aa808396c267160278b75047f2a0b96ac', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=47&libro=4143&id=9012fb39b716bd5ca1a8f9f0eb4e151ab4ebcde0', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=48&libro=4143&id=781d3ab8d324ddbfddb088c6bc6dfb984dccbe36', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=49&libro=4143&id=20835373a7d32b08864f13f73c921f5834885efa', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=50&libro=4143&id=7797076d3eeea7467bde5fe49d568fe8ac6f4345']


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
nombre_archivo_salida = os.path.join(downloadPath, bookId + ".pdf")

fusionador = PdfFileMerger()

for pdf in pdfs:
    fusionador.append(open(os.path.join(downloadPath, pdf), 'rb'))

with open(nombre_archivo_salida, 'wb') as salida:
    fusionador.write(salida)
# downloadFile(url, downloadPath + fileName)
# print('file downloaded...')
# print('exiting program...')
