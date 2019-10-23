import os
import sys
import requests

cookies = {'JSESSIONID': 'E8171293A88D476918E8599043A90D2B',
           'ezproxy': 'SfSjkR7CiQWAyDl'}

r = requests.get(
    'http://bv.unir.net:2116/ib/IB_Browser?pagina=1&libro=4143&id=b00fecc3bb84c4350816694ac0c29c742e05ed2f', cookies=cookies)
if r.status_code == 200:
    print('Success!')
    print(r.content)
elif r.status_code == 404:
    print('Not Found.')


def downloadFile(url, fileName):
    with open(fileName, "wb") as file:
        response = requests.get(url)
        file.write(response.content)


scriptPath = sys.path[0]
downloadPath = os.path.join(scriptPath, '../Downloads/')
url = sys.argv[1]
fileName = sys.argv[2]
print('path of the script: ' + scriptPath)
print('downloading file to: ' + downloadPath)
downloadFile(url, downloadPath + fileName)
print('file downloaded...')
print('exiting program...')
