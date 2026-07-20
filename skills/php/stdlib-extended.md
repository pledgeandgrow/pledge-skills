# Standard Library: Compression, Internationalization, Images

## Compression and Archive Extensions

### Zip (ZipArchive)

```php
$zip = new ZipArchive();
$status = $zip->open('archive.zip', ZipArchive::CREATE | ZipArchive::OVERWRITE);

// Add files
$zip->addFile('file.txt', 'file.txt');
$zip->addFromString('readme.txt', 'Hello World!');
$zip->addEmptyDir('subdir');
$zip->addGlob('/path/*.txt');
$zip->addPattern('/\.txt$/', '/path/');

// Extract
$zip->extractTo('/destination/');
$zip->extractTo('/dest/', ['file1.txt', 'file2.txt']);

// Read
for ($i = 0; $i < $zip->numFiles; $i++) {
    $stat = $zip->statIndex($i);
    echo $stat['name'];
}
$content = $zip->getFromName('file.txt');
$zip->deleteName('file.txt');
$zip->renameName('file.txt', 'renamed.txt');

// Set/get archive comment
$zip->setArchiveComment('My archive');
$zip->getArchiveComment();

// Encryption (PHP 7.2+)
$zip->setEncryptionName('secret.txt', ZipArchive::EM_AES_256, 'password');

$zip->close();
```

### Zlib (Gzip)

```php
// Compress/decompress
$compressed = gzencode($data, 9);  // gzip format
$decompressed = gzdecode($compressed);

$compressed = gzdeflate($data, 9); // raw deflate
$decompressed = gzinflate($compressed);

$compressed = gzcompress($data, 9); // zlib format
$decompressed = gzuncompress($compressed);

// Stream wrapper
$fp = fopen('compress.zlib://file.txt.gz', 'r');
$fp = fopen('compress.zlib://file.txt.gz', 'w', 0, $context);

// Filter
$fp = fopen('output.txt.gz', 'wb');
stream_filter_append($fp, 'zlib.deflate', STREAM_FILTER_WRITE, ['level' => 9]);
fwrite($fp, $data);
fclose($fp);

// DeflateContext / InflateContext (PHP 8.1+)
$ctx = new DeflateContext(['level' => 9]);
$compressed = deflate_add($ctx, $data, ZLIB_FINISH);

$ctx = new InflateContext();
$decompressed = inflate_add($ctx, $compressed);
```

### Bzip2

```php
// Compress/decompress
$compressed = bzcompress($data, 9);
$decompressed = bzdecompress($compressed);

// Stream
$fp = bzopen('file.bz2', 'w');
bzwrite($fp, $data);
bzclose($fp);

$fp = bzopen('file.bz2', 'r');
$data = bzread($fp, 4096);
bzclose($fp);
```

### Phar

```php
// Create a Phar archive
$phar = new Phar('myapp.phar', 0, 'myapp.phar');
$phar->startBuffering();
$phar->addFile('src/index.php', 'index.php');
$phar->addFromString('config.php', '<?php return [];');
$phar->setStub($phar->createDefaultStub('index.php'));
$phar->stopBuffering();

// PharData (tar/zip without stub)
$tar = new PharData('archive.tar');
$tar->addFile('file.txt');
$tar->compress(Phar::GZ); // creates archive.tar.gz

// Running phar
// php myapp.phar
```

### Rar

```php
$rar = RarArchive::open('archive.rar');
$entries = $rar->getEntries();
foreach ($entries as $entry) {
    echo $entry->getName() . ' (' . $entry->getUnpackedSize() . " bytes)\n";
    $entry->extract('/destination/');
}
$rar->close();
```

### LZF

```php
$compressed = lzf_compress($data);
$decompressed = lzf_decompress($compressed);
```

## Internationalization (intl)

```php
// Collator — locale-aware sorting
$coll = Collator::create('en_US');
$coll->sort($arr);
$coll->asort($arr);
$coll->compare('apple', 'banana');

// NumberFormatter
$fmt = NumberFormatter::create('en_US', NumberFormatter::CURRENCY);
echo $fmt->formatCurrency(1234.56, 'USD'); // "$1,234.56"

$fmt = NumberFormatter::create('de_DE', NumberFormatter::CURRENCY);
echo $fmt->formatCurrency(1234.56, 'EUR'); // "1.234,56 €"

$fmt = NumberFormatter::create('en_US', NumberFormatter::DECIMAL);
$fmt->setAttribute(NumberFormatter::MIN_FRACTION_DIGITS, 2);
echo $fmt->format(1234.56);

// Locale
echo Locale::getDefault();
Locale::setDefault('en_US');
$parts = Locale::parseLocale('en_US');
// ['language' => 'en', 'region' => 'US']
echo Locale::getDisplayName('fr_FR', 'en_US'); // "French (France)"
echo Locale::getPrimaryLanguage('zh_Hant_TW'); // "zh"

// Normalizer
$normalized = Normalizer::normalize($string, Normalizer::FORM_C);

// MessageFormatter — ICU message format
$fmt = MessageFormatter::create('en_US', 'You have {0, plural, =0{no items} =1{one item} other{# items}}');
echo $fmt->format([0]);  // "You have no items"
echo $fmt->format([1]);  // "You have one item"
echo $fmt->format([5]);  // "You have 5 items"

// IntlDateFormatter
$fmt = IntlDateFormatter::create('en_US', IntlDateFormatter::FULL, IntlDateFormatter::NONE, 'America/New_York');
echo $fmt->format(time()); // "Monday, January 15, 2024"

// IntlCalendar
$cal = IntlCalendar::createInstance('America/New_York', 'en_US');
$cal->set(2024, 0, 15);
$cal->add(IntlCalendar::FIELD_DAY_OF_MONTH, 30);

// Transliterator
$trans = Transliterator::create('Any-Latin; Latin-ASCII');
echo $trans->transliterate('你好'); // "Ni Hao"

// IntlChar
echo IntlChar::charName('A'); // "LATIN CAPITAL LETTER A"
IntlChar::isAlpha('a'); // true
IntlChar::isdigit('5'); // true
IntlChar::toupper('a'); // 'A'

// ResourceBundle
$rsc = ResourceBundle::create('en_US', 'ICUDATA');
```

## iconv (Character Encoding Conversion)

```php
// Convert encoding
$utf8 = iconv('ISO-8859-1', 'UTF-8', $string);
$ascii = iconv('UTF-8', 'ASCII//TRANSLIT', $string);
$utf8 = iconv('Windows-1252', 'UTF-8//IGNORE', $string);

// Get charset
echo iconv_get_encoding('input_encoding');
iconv_set_encoding('internal_encoding', 'UTF-8');

// String length in specific encoding
echo iconv_strlen($string, 'UTF-8');
echo iconv_strpos($string, $needle, 0, 'UTF-8');
echo iconv_substr($string, 0, 10, 'UTF-8');
```

## Gettext (i18n)

```php
// Set up gettext
putenv('LC_ALL=en_US.UTF-8');
setlocale(LC_ALL, 'en_US.UTF-8');
bindtextdomain('myapp', './locale');
textdomain('myapp');

// Translate
echo gettext('Hello World');   // translated string
echo _('Hello World');          // shorthand

// Plural
echo ngettext('One item', '%d items', $count);

// Domain switching
dgettext('messages', 'Hello');
dngettext('messages', 'One item', '%d items', $count);
bindtextdomain('other', './locale');
textdomain('other');

// .mo files in ./locale/en_US/LC_MESSAGES/myapp.mo
```

## GD (Image Processing)

```php
// Create image
$img = imagecreatetruecolor(400, 300);
$white = imagecolorallocate($img, 255, 255, 255);
$black = imagecolorallocate($img, 0, 0, 0);
$red = imagecolorallocate($img, 255, 0, 0);

// Fill
imagefill($img, 0, 0, $white);

// Draw
imagefilledrectangle($img, 50, 50, 150, 150, $red);
imagerectangle($img, 50, 50, 150, 150, $black);
imageline($img, 0, 0, 400, 300, $black);
imagestring($img, 5, 10, 10, 'Hello GD', $black);
imageellipse($img, 200, 150, 100, 80, $black);
imagefilledellipse($img, 200, 150, 100, 80, $red);
imagepolygon($img, [[10,10],[100,10],[50,100]], 3, $black);

// Load from file
$img = imagecreatefromjpeg('photo.jpg');
$img = imagecreatefrompng('image.png');
$img = imagecreatefromgif('image.gif');
$img = imagecreatefromwebp('image.webp');
$img = imagecreatefromavif('image.avif'); // PHP 8.1+

// Resize
$resized = imagescale($img, 200, 150);
imagecopyresized($dst, $src, 0, 0, 0, 0, $newW, $newH, $oldW, $oldH);
imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $oldW, $oldH);

// Crop
$cropped = imagecrop($img, ['x' => 0, 'y' => 0, 'width' => 100, 'height' => 100]);

// Rotate
$rotated = imagerotate($img, 90, 0);

// Filter
imagefilter($img, IMG_FILTER_GRAYSCALE);
imagefilter($img, IMG_FILTER_BRIGHTNESS, -20);
imagefilter($img, IMG_FILTER_CONTRAST, -10);
imagefilter($img, IMG_FILTER_GAUSSIAN_BLUR);

// Save
imagejpeg($img, 'output.jpg', 85); // quality 0-100
imagepng($img, 'output.png', 6);   // compression 0-9
imagegif($img, 'output.gif');
imagewebp($img, 'output.webp', 85);
imageavif($img, 'output.avif', 50); // PHP 8.1+

// Output to browser
header('Content-Type: image/png');
imagepng($img);

// Get image info
[$width, $height, $type] = getimagesize('photo.jpg');
$info = getimagesize('photo.jpg'); // ['mime' => 'image/jpeg', ...]

// Destroy
imagedestroy($img);
```

## ImageMagick (Imagick)

```php
// Create image
$imagick = new Imagick();
$imagick->newImage(400, 300, new ImagickPixel('white'));
$imagick->setImageFormat('png');

// Load
$imagick = new Imagick('photo.jpg');

// Resize
$imagick->resizeImage(200, 150, Imagick::FILTER_LANCZOS, 1);
$imagick->thumbnailImage(100, 100, true); // maintain aspect ratio

// Crop
$imagick->cropImage(100, 100, 50, 50);

// Rotate
$imagick->rotateImage(new ImagickPixel('transparent'), 90);

// Filter
$imagick->blurImage(5, 3);
$imagick->sharpenImage(0, 1);
$imagick->colorizeImage('#ff0000', 0.5);

// Convert format
$imagick->setImageFormat('webp');

// Composite (overlay)
$overlay = new Imagick('overlay.png');
$imagick->compositeImage($overlay, Imagick::COMPOSITE_OVER, 0, 0);

// Write
$imagick->writeImage('output.png');

// Output
header('Content-Type: image/png');
echo $imagick->getImageBlob();

// ImagickDraw — drawing
$draw = new ImagickDraw();
$draw->setFillColor('red');
$draw->rectangle(50, 50, 150, 150);
$draw->setFontSize(20);
$draw->annotation(10, 30, 'Hello');
$imagick->drawImage($draw);

// ImagickKernel — convolution
$kernel = ImagickKernel::fromMatrix([[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]);
$imagick->filter($kernel);
```

## Exif (Exchangeable Image Information)

```php
// Read EXIF data
$exif = exif_read_data('photo.jpg');
// ['FileName', 'FileSize', 'MimeType', 'Make', 'Model', 'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'DateTime', 'GPSLatitude', ...]

// Thumbnail
$thumbnail = exif_thumbnail('photo.jpg', $width, $height, $type);

// Supported types
exif_imagetype('photo.jpg'); // IMAGETYPE_JPEG = 2
exif_tagname(0x010F);        // 'Make'
```
