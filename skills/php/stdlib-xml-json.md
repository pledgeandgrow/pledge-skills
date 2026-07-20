# Standard Library: XML, JSON, cURL

## JSON

```php
// Encode
$json = json_encode($data);
$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$json = json_encode($data, JSON_THROW_ON_ERROR); // throw on error (PHP 7.3+)

// Decode
$data = json_decode($json);        // object (stdClass)
$data = json_decode($json, true);  // associative array
$data = json_decode($json, false, 512, JSON_THROW_ON_ERROR);

// Error handling (without JSON_THROW_ON_ERROR)
json_last_error(); // JSON_ERROR_NONE, JSON_ERROR_SYNTAX, etc.
json_last_error_msg();

// JsonSerializable interface
class User implements JsonSerializable {
    public function __construct(
        public readonly int $id,
        public readonly string $name,
    ) {}

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}

echo json_encode(new User(1, 'Alice'));

// JsonException (PHP 7.3+)
try {
    $data = json_decode($json, true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo $e->getMessage();
}

// Constants
JSON_PRETTY_PRINT; JSON_UNESCAPED_SLASHES; JSON_UNESCAPED_UNICODE;
JSON_THROW_ON_ERROR; JSON_FORCE_OBJECT; JSON_NUMERIC_CHECK;
JSON_PARTIAL_OUTPUT_ON_ERROR; JSON_PRESERVE_ZERO_FRACTION;
JSON_INVALID_UTF8_SUBSTITUTE; JSON_INVALID_UTF8_IGNORE;
```

## SimdJSON (High-performance JSON parsing)

```php
// Simdjson extension — faster JSON parsing using SIMD instructions
$data = simdjson_decode($json, true);
$is_valid = simdjson_is_valid($json);
$key_exists = simdjson_key_exists($json, 'path.to.key');
$value = simdjson_key_value($json, 'path.to.key');

// SimdJsonException on parse errors
```

## cURL

```php
// Basic GET request
$ch = curl_init('https://api.example.com/data');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$info = curl_getinfo($ch);
curl_close($ch);

// OOP style with CurlHandle (PHP 8.0+)
$ch = curl_init('https://api.example.com/data');
$ch->setOpt(CURLOPT_RETURNTRANSFER, true);
$response = $ch->exec();
$ch->close();

// POST request
$ch = curl_init('https://api.example.com/users');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode(['name' => 'Alice']),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $token,
    ],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_CAINFO => '/path/to/cacert.pem',
]);
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Multi-handle (parallel requests)
$mh = curl_multi_init();
$handles = [];
foreach ($urls as $url) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_multi_add_handle($mh, $ch);
    $handles[] = $ch;
}

do {
    $status = curl_multi_exec($mh, $active);
    if ($active) {
        curl_multi_select($mh);
    }
} while ($active && $status === CURLM_OK);

foreach ($handles as $ch) {
    $response = curl_multi_getcontent($ch);
    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
}
curl_multi_close($mh);

// File upload
$ch = curl_init('https://api.example.com/upload');
$cfile = new CURLFile('/path/to/file.txt', 'text/plain', 'filename.txt');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => ['file' => $cfile],
]);
$response = curl_exec($ch);
curl_close($ch);

// CURLStringFile (PHP 8.1+)
$file = new CURLStringFile('file content here', 'filename.txt', 'text/plain');
```

## DOM (Document Object Model)

```php
// HTML parsing
$dom = new DOMDocument();
@$dom->loadHTML($htmlString);
$dom->loadHTMLFile('page.html');

// XML parsing
$dom = new DOMDocument();
$dom->load('file.xml');
$dom->loadXML($xmlString);
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;

// Navigate
$root = $dom->documentElement;
$children = $root->childNodes;
$element = $dom->getElementById('myid');
$elements = $dom->getElementsByTagName('div');

// Create
$newNode = $dom->createElement('item', 'content');
$attr = $dom->createAttribute('id');
$attr->value = 'new-item';
$newNode->appendChild($attr);
$root->appendChild($newNode);

// XPath
$xpath = new DOMXPath($dom);
$nodes = $xpath->query('//div[@class="article"]');
foreach ($nodes as $node) {
    echo $node->textContent;
}

// Save
$dom->save('output.xml');
echo $dom->saveXML();
echo $dom->saveHTML();

// Dom\HTMLDocument (PHP 8.4+ — modern HTML5 parsing)
$doc = Dom\HTMLDocument::createFromString($html);
$doc = Dom\HTMLDocument::createFromFile('page.html');
$elements = $doc->querySelectorAll('.article');
$element = $doc->querySelector('#main');
```

## SimpleXML

```php
// Load XML
$xml = simplexml_load_string($xmlString);
$xml = simplexml_load_file('file.xml');

// Access elements
echo $xml->title;
echo $xml->item[0]->name;
echo $xml['id']; // attribute

// Iterate
foreach ($xml->children() as $child) {
    echo $child->getName() . ': ' . $child;
}

// Attributes
foreach ($xml->attributes() as $name => $value) {
    echo "$name = $value";
}

// XPath
$results = $xml->xpath('//item[@type="book"]');

// Add elements
$xml->addChild('newitem', 'value');
$xml->newitem->addAttribute('id', '123');

// Save
echo $xml->asXML();
$xml->asXML('output.xml');

// Convert to JSON
$json = json_encode($xml);
$array = json_decode($json, true);
```

## XMLReader (Pull Parser)

```php
$reader = new XMLReader();
$reader->open('file.xml');

while ($reader->read()) {
    if ($reader->nodeType === XMLReader::ELEMENT && $reader->name === 'item') {
        $xml = $reader->readOuterXML();
        $item = simplexml_load_string($xml);
        // process $item
    }
}
$reader->close();
```

## XMLWriter (Push Writer)

```php
$writer = new XMLWriter();
$writer->openMemory();
$writer->startDocument('1.0', 'UTF-8');
$writer->startElement('root');
$writer->writeElement('title', 'Hello');
$writer->startElement('items');
$writer->writeElement('item', 'Value 1');
$writer->writeElement('item', 'Value 2');
$writer->endElement(); // items
$writer->endElement(); // root
$writer->endDocument();

echo $writer->outputMemory();
```

## XSL (XSLT)

```php
$xsl = new DOMDocument();
$xsl->load('transform.xsl');
$processor = new XSLTProcessor();
$processor->importStylesheet($xsl);

$xml = new DOMDocument();
$xml->load('data.xml');

echo $processor->transformToXML($xml);
$processor->transformToURI($xml, 'file:///output.html');
```

## XML-RPC

```php
// XML-RPC extension (legacy — consider REST/JSON APIs instead)
$request = xmlrpc_encode_request('method', ['param1', 'param2']);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: text/xml',
        'content' => $request,
    ],
]);
$response = file_get_contents('http://rpc.example.com', false, $context);
$result = xmlrpc_decode($response);
```
