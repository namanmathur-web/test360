import json,base64,io,re,os
from PIL import Image
HERE=os.path.dirname(os.path.abspath(__file__))
R=os.path.dirname(os.path.dirname(HERE))+'/reference/'
def b64(path,maxw,fmt='JPEG',q=80):
    im=Image.open(path)
    if fmt=='JPEG': im=im.convert('RGB')
    if im.width>maxw: im=im.resize((maxw,round(im.height*maxw/im.width)),Image.LANCZOS)
    b=io.BytesIO();im.save(b,fmt,quality=q) if fmt=='JPEG' else im.save(b,fmt,optimize=True)
    return f'data:image/{fmt.lower()};base64,'+base64.b64encode(b.getvalue()).decode()
IMG=dict(hero=b64(R+'01_screens/board/real/hero.jpg',720),results=b64(R+'01_screens/board/real/results_jee.jpg',400),
 bitsat=b64(R+'02_banners/img/BITSAT_exam_tile.png',240,'PNG'),nda=b64(R+'02_banners/img/NDA_exam_tile.png',297))
names=[]
for line in open(R+'01_screens/SCREEN_LIST.md',encoding='utf-8'):
    m=re.match(r'(\d+)\. (.+?) — ',line)
    if m: names.append(m.group(2))
assert len(names)==62,len(names)
B=HERE+'/'
h=open(B+'shell.html').read()
js=''.join(open(B+f).read()+'\n' for f in ['app1.js','app2.js','app3.js','app4.js','app5.js','app6.js'])
h=h.replace('/*CSS*/',open(B+'app.css').read()).replace('/*DATA*/',open(B+'data.json').read().replace('</','<\\/')).replace('/*NAMES*/',json.dumps(names,ensure_ascii=False)).replace('/*IMG*/',json.dumps(IMG)).replace('/*JS*/',js)
open(os.path.dirname(HERE)+'/Vedantu_Test360_demo.html','w').write(h)
print(len(h))
