#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');
const QRCode = require('qrcode');

const PORT = 9690;

// ローカルIPアドレスを取得
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // IPv4で内部ネットワークのアドレスを取得
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIP = getLocalIP();
const url = `http://${localIP}:${PORT}`;

// Next.jsの開発サーバーを起動
const nextDev = spawn('next', ['dev', '-p', PORT], {
  stdio: 'inherit',
  shell: true,
});

// サーバー起動後、QRコードを表示
setTimeout(() => {
  console.log('\n\n' + '='.repeat(60));
  console.log('📱 スマートフォンでアクセス可能なURL');
  console.log('='.repeat(60));
  console.log(`\n🔗 ${url}\n`);
  console.log('QRコードをスキャンしてアクセス:');
  console.log('');

  QRCode.toString(url, { type: 'terminal', width: 12 }, (err, qrString) => {
    if (!err) {
      console.log(qrString);
    }
    console.log('='.repeat(60) + '\n');
  });
}, 2000);

// プロセス終了時の処理
process.on('SIGINT', () => {
  nextDev.kill();
  process.exit();
});

nextDev.on('exit', (code) => {
  process.exit(code);
});
