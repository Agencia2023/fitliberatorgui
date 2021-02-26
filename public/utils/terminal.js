const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const script_name = 'config.sh'
const script_name_win = 'config.bat'

module.exports = currentPath => {

    let exc = ''
    /**
     * MAC
     */
    if (process.platform === "darwin") {
        /**
         * set custom path to open CLI
         */
        exc = `${currentPath}/${script_name}`        

        fs.writeFileSync(exc, `#!/usr/bin/osascript  \n tell app "Terminal" \n \t  do script "export PATH=$PATH:${currentPath}; clear;fits" \n end `);
        fs.chmodSync(exc, "755")        

    }
    else if (process.platform === "win32") {

        exc = `${path.join(currentPath, script_name_win)}`

        const script_content = `START  cmd /k  set PATH=%PATH%;${currentPath}`
        fs.writeFileSync(exc, script_content);
        fs.chmodSync(exc, "755")

    }
    else if (process.platform === 'linux') {

        exc = `${currentPath}/${script_name}`

        const terminal = 'gnome-terminal'        
        fs.writeFileSync(exc, `#!/bin/sh  ${terminal} export PATH=$PATH:${currentPath} `);
        fs.chmodSync(exc, "755")        
    }

    /**
       * run terminal with CUSTOM PATH
       */
    child_process.exec(`"${exc}"`)

}

