from playwright.sync_api import sync_playwright
F='file:///home/claude/Vedantu_Self_Study_Platform_Limits.html'
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':390,'height':844})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.route('**/*',lambda r:r.abort() if r.request.url.startswith('http') else r.continue_())
    pg.goto(F);pg.wait_for_timeout(500)
    pg.click('[data-a=setlang]')
    pg.screenshot(path='x_home_m.png')
    pg.click('[data-a=starttest]');pg.screenshot(path='x_test_m.png')
    pg.click('[data-a=fill]');pg.wait_for_timeout(300);pg.screenshot(path='x_result_m.png',full_page=True)
    pg.click('[data-a=tab][data-v=ans]');pg.wait_for_timeout(300)
    print('sol' , pg.evaluate("document.querySelectorAll('.why.sol').length"))
    pg.evaluate("document.querySelectorAll('button.step').forEach(b=>b.disabled=false)")
    pg.click('button.step[data-to=path]');pg.wait_for_timeout(300);pg.screenshot(path='x_path_m.png',full_page=True)
    pg.evaluate("document.querySelectorAll('button.step').forEach(b=>b.disabled=false)");pg.click('button.step[data-to=pack]');pg.wait_for_timeout(300);pg.screenshot(path='x_pack_m.png',full_page=True);pg.click('[data-a=unlock][data-plan=pack]');pg.wait_for_timeout(300);pg.click('[data-a=startrt]');pg.wait_for_timeout(400);pg.screenshot(path='x_rt_m.png')
    pg.click('[data-a=fillrt]');pg.wait_for_timeout(400);pg.screenshot(path='x_rt2_m.png',full_page=True)
    print(errs)
    b.close()
