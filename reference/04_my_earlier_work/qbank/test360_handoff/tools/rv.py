import re,json
c=open('../book/clean.html',encoding='utf8').read()
i=c.find('data-rv-part="sheet"');j=c.find('data-rv-part="mind"',i);k=c.find('data-rv-part="cards"',j)
end=c.find('</div>\n',k)  # rough
sheet=c[i:j];mind=c[j:k];e=c.find('id="rk-cards-c1"',k);cards=c[k:e]
# sheet
groups=[];cur=None
for m in re.finditer(r'<div class="rc-sb">(.*?)</div>|<div class="rc" style="--k:(#\w+);--k2:(#\w+)">(.*?)<div class="rc-no">',sheet,re.S):
    if m.group(1) is not None:
        cur={'sub':m.group(1),'items':[]};groups.append(cur)
    else:
        b=m.group(4)
        h=re.search(r'<div class="rc-h">(.*?)</div>',b,re.S).group(1).replace('&nbsp;',' ')
        no,title=h.split('  ',1) if '  ' in h else h.split(' ',1)
        row=re.search(r'<div class="rc-row">\s*<div>(.*?)</div>\s*<div class="rc-df">(.*)</div>\s*</div></div>',b,re.S)
        txt=row.group(1) if row else ''
        fs=re.findall(r'<div>(\$\$.*?\$\$)</div>',row.group(2),re.S) if row else []
        clip=re.search(r'data-clip="([^"]+)"',b)
        cur['items'].append(dict(no=no.strip(),title=title.strip(),k=m.group(2),k2=m.group(3),text=txt,f=fs,clip=clip.group(1) if clip else ''))
# mind
boxes=[]
for m in re.finditer(r'<div class="mc" data-n="(\d)" data-side="(\w)" style="--c:(#\w+)">\s*<div class="mc-t">(.*?)</div>\s*<div class="mc-bd">(.*?)<div class="mc-d">',mind,re.S):
    boxes.append(dict(n=int(m.group(1)),c=m.group(3),t=m.group(4),b=re.findall(r'<p>(.*?)</p>',m.group(5),re.S)))
root=re.search(r'class="mc-root">(.*?)</div>',mind).group(1)
# cards
cl=[]
for m in re.finditer(r'<div class="fc-k">(\w+) &middot; ([\d.]+)</div>\s*<div class="rk-q">(.*?)</div>\s*<div class="rk-a">(.*?)</div>',cards,re.S):
    a=m.group(4);fs=re.findall(r'\$\$.*?\$\$',a,re.S);txt=re.sub(r'\$\$.*?\$\$','',a,flags=re.S).strip()
    cl.append(dict(kind=m.group(1),no=m.group(2),q=m.group(3),f=fs,a=txt))
print(len(groups),sum(len(g['items']) for g in groups),len(boxes),len(cl),root)
from collections import Counter;print(Counter(x['kind'] for x in cl))
json.dump(dict(groups=groups,mind=boxes,root=root,cards=cl),open('revise.json','w'),ensure_ascii=False)
for g in groups: print(g['sub'],len(g['items']),g['items'][0]['k'])
