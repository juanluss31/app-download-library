# from urllib.parse import urlparse
from urllib import parse
import os
import sys
import requests

cookies = {'JSESSIONID': 'B0B5285547B7058A8221AD036D7E28C0',
           'ezproxy': 'z8wprER67biu2Pi'}

# r = requests.get(
#     'http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=0c386e54d9c67029abf71181e4bfd3b22f2e13cd', cookies=cookies)
# if r.status_code == 200:
#     print('Success!')
#     print(r.content)
# elif r.status_code == 404:
#     print('Not Found.')


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

# Un directorio mas atras crea la carpeta UnirLibrary
downloadPath = os.path.join(scriptPath, 'UnirLibrary')

pages = ["http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=8a02073219026586d310c503bac7307eaad195ad"]
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
# downloadFile(url, downloadPath + fileName)
# print('file downloaded...')
# print('exiting program...')
