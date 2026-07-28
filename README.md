# instagram

C:\USERS\SRINI\DOWNLOADS\INSTAGRAM        (ఇది మీ project root)
│
├───public                                (ఇక్కడ అన్ని frontend files ఉంచాలి)
│   │   index.html
│   │   script.js
│   │   styles.css
│   │
│   ├───home
│   │   ├───posts      (image posts ఉంటే ఇక్కడ)
│   │   ├───profiles   ✅ ab_comedy_182.jpg
│   │   └───reels      ✅ 4 MP4 files (Shiva_ball_hit.mp4, ...)
│   │
│   └───stories
│       ├───profiles   ✅ vimage1.jpg, iimage1.jpg, ... (10 profile photos)
│       └───story_media ✅ vvideo1.mp4, smimage1.jpg, ... (10 story media)
│
├───server.js           (Backend Node.js code)
├───package.json        (Node.js dependencies)
├───.gitignore          (Git కోసం – node_modules, .env వంటివి ignore చేయడానికి)
└───README.md           (optional)


# Create all folders
mkdir -p public/home/{posts,profiles,reels} public/stories/{profiles,story_media}

# Create all files
touch public/index.html public/script.js public/styles.css server.js .gitignore README.md

apt install nodejs npm -y

node -v
npm -v

npm init -y
npm install express socket.io
npm install mysql2