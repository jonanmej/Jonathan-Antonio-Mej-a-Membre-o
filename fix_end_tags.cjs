const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The main tag was opened, we need </div></div></main>
// We replace:
//            )}
//          </div>
//        </main>
// With:
//            )}
//          </div>
//        </div>
//        </main>
code = code.replace(/(\s*)\)\}\n\s*<\/div>\n\s*<\/main>/g, "$1)}\n          </div>\n        </div>\n        </main>");

fs.writeFileSync('src/App.tsx', code);
