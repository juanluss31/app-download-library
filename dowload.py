# from urllib.parse import urlparse
from PyPDF2 import PdfFileMerger
from urllib import parse
import os
import sys
import requests

cookies = {'JSESSIONID': '346C3644CB39707F40F9650FCED2D1B9',
           'ezproxy': 'o9oPNqFJq41elOj'}
pages = ['http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=55c06706b9252d1fb41afb5f213658895a407d0a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=2&libro=4143&id=489e22826a93b9acd4bd0a53fb29543087249412', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=3&libro=4143&id=0d6f5a9a0b6d3051b238ad3b777bbe88577b111e', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=4&libro=4143&id=31ee820b7345795e0378da06b09f720cfdf4b928', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=5&libro=4143&id=c6e16e63ed617dcdf0bcbf61b629e0b9e0807482', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=6&libro=4143&id=5a5f529764d58a85d5cbf8d62ca57f55eedb9aec', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=7&libro=4143&id=8574986f4b75cea587737700b6777b20d298e653', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=8&libro=4143&id=cb4f98f5b1a1f765847db222fabb12953f877278', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=9&libro=4143&id=169186df1573786288b6cd6bfee81d2fa811b885', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=10&libro=4143&id=c6d89e0a4c24319dca27e438b985ebb5339e4788', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=11&libro=4143&id=c2bb3e507a32ff66814ea1064b1a544e9da1b849', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=12&libro=4143&id=e2b2bbe2274852dc4cdf7509e51b6b6a736dd580', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=13&libro=4143&id=b86a8340be0574d54072e97f68786f914e524a5c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=14&libro=4143&id=b881248a5dec95878b1f2d743996675ddeffbca8', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=15&libro=4143&id=d1275c8788ccb5ff3c50104bbfaaecffe928d545', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=16&libro=4143&id=296ccf3b2d0c304f9d30c39108381f5dc2ddb812', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=17&libro=4143&id=c6436f7dc1e771984476e89a0ce9d5b1aca7427c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=18&libro=4143&id=2959656a3c8264dcf2a6ccd32c7ffac0e7858e9f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=19&libro=4143&id=b42bf9c3c42e5748f8d2c89a595c460188fb5ae3', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=20&libro=4143&id=08e0334a20cf0b611855da00e7f583f616b0ed0f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=21&libro=4143&id=1c6aba4636ad201128cf5c350576cdd4178b9fd0', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=22&libro=4143&id=1de36263a33b7d9a677bd984d3c801470098aabb', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=23&libro=4143&id=fe5c5ba66a0d7058e5ef1203bd2da8dffcee79bf', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=24&libro=4143&id=a22e3512d278b04eb36906cd4a443d6b48d5dae2', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=25&libro=4143&id=69c7cc677fd03ff38b5d82eeb4a74f8d2c3ec779', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=26&libro=4143&id=9bfdfaeeea1f6a6107c78dcd06b6cee982efc536', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=27&libro=4143&id=9713ba6e70491a7d3211e63cae6fecdebb954d87', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=28&libro=4143&id=cfd689ca7c4661ab1a90c3fb8aea4dd35b90b713', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=29&libro=4143&id=2725fc96c6b284a982523bf1ad986db3f19d1632', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=30&libro=4143&id=4d5abf4033691e50a9395c634daa1e21f532acbe', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=31&libro=4143&id=9cd077a8d316d388d67692b7449cee8a94365e70', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=32&libro=4143&id=aa9360c22d06dabc0ef09622ffc528459c343a10', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=33&libro=4143&id=5ecb975178bb677ea4d69c5d21fb7aed39c47ade', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=34&libro=4143&id=d8ae3b40772ccf8bea4b9b543fecad99a85fc94c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=35&libro=4143&id=87950272042b9079c6a595050de812866bdc1716', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=36&libro=4143&id=58abd25079b0838d0bf8fd1793d2dd0e17bb27b2', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=37&libro=4143&id=5149091c077a207632191e0b8f25fd4b4b63e10b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=38&libro=4143&id=ad0d3579ea6520df6a718a2e11b513a648ce2e75', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=39&libro=4143&id=02f28ecb2d59424b10b72b92325bf7b399eba372', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=40&libro=4143&id=d88f08cd99891f3b0de1b24315d17d4b09b1c371', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=41&libro=4143&id=63bef2a4bab4ba73e34bf225f956c2e640ee62ef', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=42&libro=4143&id=42a0afbaac4355ebfda669577b462117f37e0b18', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=43&libro=4143&id=ac3fbbaa50264c87ea09ac3c67e07924ead9213b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=44&libro=4143&id=5449ae5bc3b103f32800d0e89d96a387ba7c0b55', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=45&libro=4143&id=3f53c65fd87c5666a32ea3d8c1aeb126c578733c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=46&libro=4143&id=9dce37eb36525f2738ff8ae98d571566e5a96189', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=47&libro=4143&id=ab8ba3be253d2be847ac137891ba5baf1e51ffee', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=48&libro=4143&id=83e186d171e505a8349dfc28d03f3b85dd9e60a5', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=49&libro=4143&id=174abc49e12aa8f8799293083da482c7c8ae6245', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=50&libro=4143&id=f2e3c0d738ad9d8ff286e77d448aae51b34cb30c',
         'http://bv.unir.net:2116/ib/IB_Browser?pagina=51&libro=4143&id=f29c3f129bd6bb4d7fbc536bc47ee8fcb5dc4895', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=52&libro=4143&id=fa602228c75c9b916e2a34caf34233731b998be8', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=53&libro=4143&id=c4d64263adba544d11d59c11108d43a92ac4c989', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=54&libro=4143&id=4183998fade02c838c94a0690e9ff50cbd51886c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=55&libro=4143&id=26522de9c854cd91b0998bd144aa6644b17a009b', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=56&libro=4143&id=d90e863579ad549f7c9704e21efdfb7847d65592', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=57&libro=4143&id=e5528b5502224bc37b8841134f7b36a3a33c779a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=58&libro=4143&id=2b2de46fdcfd8de44c1169271afd9273ebe983b7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=59&libro=4143&id=e7a2f86c8b9ea9bc9e12b75ca6202c6109b6c37e', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=60&libro=4143&id=b0e62df9aed6c6e067c2752303893ddfeed4144c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=61&libro=4143&id=c459a732aab0cff75e4fe2e2d634c62780aefb29', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=62&libro=4143&id=f28b2a3212e256c7532a1914fb95b74aeaf58af1', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=63&libro=4143&id=e121b614a193547f1f205c65dc6e47a08a0ca2b7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=64&libro=4143&id=5ca723a88a9ab8899aaa1e208fd9fa94d9cdacfb', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=65&libro=4143&id=4106bb36d0f006cba2d7e6b3b5f73a9ad7a6658c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=66&libro=4143&id=5b3556ce689e67b5f8e9fbb1a28150e3bd79d15d', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=67&libro=4143&id=aa88da822c976ae5a417436b4d6b3bc2d3c9fcb3', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=68&libro=4143&id=b1b7ec6299daefa79fc8633f17711ac6f0f50781', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=69&libro=4143&id=1056f165a5b4d1118907adba239b9227ebf082d2', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=70&libro=4143&id=88340fe5373dde56ff8c9ced58c073c40b4894f4', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=71&libro=4143&id=b30cb988f7df703cf5a917195f77eb4cb87e1471', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=72&libro=4143&id=60dcedc5dd3877c7619cfa340fed806032bdbdfb', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=73&libro=4143&id=3f10d9e1367667374a6d605c3db80c4c0bcec835', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=74&libro=4143&id=17f5be5792143e026af8519595d5ae300b0f6527', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=75&libro=4143&id=7faad4a9fb23441acc77a461fc83da885b30504a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=76&libro=4143&id=f6635f00f58ad8d89dae5a7e0b526cd4a97ee5d0', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=77&libro=4143&id=0a8e898e187b81f30dbbe2640c901819560da3bf', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=78&libro=4143&id=d795bcffe8b1f637062efcd81c879e7fe5b457c1', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=79&libro=4143&id=576f1fb6157bb06602632cf2f495a567a3a37210', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=80&libro=4143&id=50a1676627bd63cb8f8cd00324340e09dd9836a6', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=81&libro=4143&id=33d415c86577b5477f962930639483039ca32210', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=82&libro=4143&id=bd75f63e0581e41cb75388d796f81b3086656a68', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=83&libro=4143&id=a07dfaca2da0a157d4dc6e13e81038e7e12fa00a', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=84&libro=4143&id=3c5590f1f3171ca4cf524dcc4cd7929fe0e1b263', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=85&libro=4143&id=0cdc870f2ae88214a477dcc83eb3a53362cb8d11', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=86&libro=4143&id=80e2f825eafcb52a37537927348bead1f00a7f34', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=87&libro=4143&id=8503e29fb79d2e86d88b18285127a387a4ce4943', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=88&libro=4143&id=9c35529508bad9042e4de229446bf6002983879f', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=89&libro=4143&id=eef066d766f749436ec73eb891ce849d92b6d715', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=90&libro=4143&id=7bdc2e75e3d1f0f76a42521e0156d54b12370975', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=91&libro=4143&id=423e2173316f2989f4eed5aa32e91cd6ecc01a14', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=92&libro=4143&id=9c5da9cad98daed921ab3daa9adb8a294bed313c', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=93&libro=4143&id=66ec47c424c574987a0efcfea6f5115c5b0df913', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=94&libro=4143&id=d20c7d5ecf3b32c8a92668cb93dbc4b471bbd562', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=95&libro=4143&id=716cf1d17c4e397eee1192657081f2c49d08e9e5', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=96&libro=4143&id=03f69f4cf831e3ecdde30c56dc6903323299795d', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=97&libro=4143&id=84b7da5576f645748202b4770ae49751d93dfb93', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=98&libro=4143&id=2c2e67bed11dba92ee1217f2308cc22a57dfbab7', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=99&libro=4143&id=11e51627c54aff2e220ba05719efaf6b63360e25', 'http://bv.unir.net:2116/ib/IB_Browser?pagina=100&libro=4143&id=5f8fc24255eb7773ce99dea54893afdf0d90a240']


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
