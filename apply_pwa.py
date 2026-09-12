from pathlib import Path
root=Path(__file__).resolve().parent
for name in ('index.html','login.html','admin.html'):
 p=root/name
 if not p.exists(): print('SKIP',name); continue
 s=p.read_text(encoding='utf-8'); manifest='admin-manifest.webmanifest' if name=='admin.html' else 'manifest.webmanifest'
 head='\n'.join([f'<link rel="manifest" href="./{manifest}">','<link rel="apple-touch-icon" href="./apple-touch-icon.png">','<link rel="icon" type="image/png" href="./favicon-64.png">','<meta name="theme-color" content="#1e293b">','<meta name="apple-mobile-web-app-capable" content="yes">','<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'])
 if 'rel="manifest"' not in s: s=s.replace('</head>',head+'\n</head>',1)
 if 'pwa-install.js' not in s: s=s.replace('</body>','<script src="./pwa-install.js" defer></script>\n</body>',1)
 p.write_text(s,encoding='utf-8'); print('PATCHED',name)
