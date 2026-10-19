    case "rvtab":BC.tab=d.v;render();return true;
    case "bcflip":BC.flip=!BC.flip;render();return true;
    case "bcgo":BC.i=(BC.i+ +d.d+Math.max(1,bcPool().length))%Math.max(1,bcPool().length);BC.flip=false;render();return true;
    case "bckind":BC.kind=d.v;BC.i=0;BC.flip=false;render();return true;
    case "bctop":BC.top=+d.v;BC.i=0;BC.flip=false;render();return true;
    case "bcmark":(function(){var p=bcPool(),x=p[BC.i];if(x){BC.got[x.i]=d.v;bcSave();}BC.i=(BC.i+1)%Math.max(1,p.length);BC.flip=false;render();})();return true;
