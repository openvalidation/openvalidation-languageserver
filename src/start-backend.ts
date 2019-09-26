var path = require('path');

import { exec, ChildProcess } from 'child_process';

// Starts the spring-boot-backend
var exePath = path.join(__dirname, "/rest-interface/ov-rest.exe");
var child: ChildProcess = exec(exePath);

child.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
});

child.stderr.on('data', (stderr) => {
    console.log('stderr: ' + stderr);
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});