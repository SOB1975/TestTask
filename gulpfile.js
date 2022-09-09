import gulp from 'gulp';
import sync from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
// показывает ошибки scss
import notify from 'gulp-notify';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import fileinclude from 'gulp-file-include';
import svgSprite from 'gulp-svg-sprite';
import ttf2Woff from 'gulp-ttf2woff';
import ttf2Woff2 from 'gulp-ttf2woff2';
import fs from 'fs';
import del from 'del';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import uglify from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import gutil from 'gulp-util';
import ftp from 'vinyl-ftp';



// html

export const htmlinclude = () => {
  return gulp.src('./src/*.html')
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(sync.stream());
};

//sourcemap,rename min.css,autoprefixer,cleancss
export const styles = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(sync.stream());
}
//js scripts
const scripts = () => {
  return gulp.src('./src/js/main.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      },
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })

    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/js'))
    .pipe(sync.stream());
}
//img
export const imgToDist = () => {
  return gulp.src(['./src/img/**/**.jpg', './src/img/**/**.png', './src/img/**/**.jpeg'])
    .pipe(gulp.dest('./dist/img'))
}
// svg Sprite
export const svgSprites = () => {
  return gulp.src('./src/img/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(gulp.dest('./dist/img'))
}
// fonts
export const fonts = () => {
  gulp.src('./src/fonts/**.ttf')
    .pipe(ttf2Woff())
    .pipe(gulp.dest('./dist/fonts/'))
  return gulp.src('./src/fonts/**.ttf')
    .pipe(ttf2Woff2())
    .pipe(gulp.dest('./dist/fonts/'))
}
//fontsStyle
const cb = () => {}
let srcFonts = './src/scss/_fonts.scss';
let distFonts = './dist/fonts';

export const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, '', cb);

  fs.readdir(distFonts, function (err, items) {
    if (items) {
      let c_fontname;

      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname + '","' + fontname + '", 400);\r\n', cb);
        }
        c_fontname = fontname;
      }
    }
  })
  done();
}


//resources
export const resources = () => {
  return gulp.src('./src/resources/**')
    .pipe(gulp.dest('./dist'))
}

export const svgToDist = () => {
  return gulp.src('./src/img/svg/*.svg')
    .pipe(gulp.dest('./dist/img/svg'))
}
// Clean
export const clean = () => {
  return del(['dist/*'])
}
// watch
export const watchFiles = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: './dist'
    }
  });
  // следим за файлами стилей
  gulp.watch('./src/scss/**/**.scss', styles);
  gulp.watch('./src/**.html', htmlinclude);
  gulp.watch('./src/img/**/**.jpg', imgToDist);
  gulp.watch('./src/img/**/**.png', imgToDist);
  gulp.watch('./src/img/**/**.jpeg', imgToDist);
  gulp.watch('./src/img/**.svg', svgSprites);
  gulp.watch('./src/resources/**', resources);
  gulp.watch('./src/img/svg/**.svg', svgToDist);
  gulp.watch('./src/fonts/**.ttf', fonts);
  gulp.watch('./src/fonts/**.ttf', fontsStyle);
  gulp.watch('./src/js/**/**.js', scripts);
};

// Watch

export const watch = () => {
  gulp.watch('src/*.html', gulp.series(html));
  // gulp.watch('src/scss/*.scss', gulp.series(styles));
  // gulp.watch('src/js/**/*.js', gulp.series(scripts));
};


// Default

export default gulp.series(
  // gulp.parallel(
  clean,
  gulp.parallel(
    htmlinclude,
    scripts,
    fonts,
    imgToDist,
    svgSprites,
    resources,
    svgToDist,
  ),
  fontsStyle,
  styles,
  watchFiles,
);
//Build version
export const stylesBuild = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(gulp.dest('./dist/css/'))
}

export const scriptsBuild = () => {
  return gulp.src('./src/js/main.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      },
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(uglify().on("error", notify.onError()))
    .pipe(gulp.dest('./dist/js'))
}
//ImgMin
export const imageMin = () => {
  return gulp.src(['./src/img/**/**.jpg', './src/img/**/**.png', './src/img/**/**.jpeg'])
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'))
}

export const build = gulp.series(clean, gulp.parallel(htmlinclude, scriptsBuild, fonts, resources, imgToDist, svgSprites), fontsStyle, stylesBuild, imageMin);
// deploy
const depLoy = () => {
  let conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'dist/**',
  ];

  return gulp.src(globs, {
      base: './dist',
      buffer: false
    })
    .pipe(conn.newer('')) // only upload newer files
    .pipe(conn.dest(''));
}

export const deploy = gulp.series(depLoy);