# Symfony — Database, Forms & Validation

> Doctrine ORM, database operations, form creation/processing, and data validation.

**Doctrine**: [symfony.com/doc/current/doctrine.html](https://symfony.com/doc/current/doctrine.html)  
**Forms**: [symfony.com/doc/current/forms.html](https://symfony.com/doc/current/forms.html)  
**Validation**: [symfony.com/doc/current/validation.html](https://symfony.com/doc/current/validation.html)  

## Databases and the Doctrine ORM

### Installing Doctrine

```bash
composer require doctrine
```

### Configuring the Database

```dotenv
# .env
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=8.0&charset=utf8mb4"
```

### Creating an Entity Class

```php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?float $price = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    // Getters and setters...
    public function getId(): ?int { return $this->id; }
    public function getName(): ?string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }
    public function getPrice(): ?float { return $this->price; }
    public function setPrice(float $price): static { $this->price = $price; return $this; }
}
```

### Entity Field Types

| Type | Description |
|------|-------------|
| `string` | String (length required) |
| `text` | Long text |
| `integer` | Integer |
| `float` | Float |
| `decimal` | Decimal number |
| `boolean` | Boolean |
| `date` | Date |
| `datetime` | Date and time |
| `datetime_immutable` | Immutable datetime |
| `json` | JSON data |
| `array` | PHP array (serialized) |
| `simple_array` | Simple array (comma-separated) |

### Migrations: Creating the Database Schema

```bash
# Create a migration
php bin/console make:migration

# Execute the migration
php bin/console doctrine:migrations:migrate

# Check migration status
php bin/console doctrine:migrations:status
```

### Persisting Objects to the Database

```php
use Doctrine\ORM\EntityManagerInterface;

class ProductController extends AbstractController
{
    #[Route('/product', name: 'product_create')]
    public function create(EntityManagerInterface $entityManager): Response
    {
        $product = new Product();
        $product->setName('Keyboard');
        $product->setPrice(99.99);

        $entityManager->persist($product);
        $entityManager->flush();

        return new Response('Saved new product with id ' . $product->getId());
    }
}
```

### Fetching Objects from the Database

```php
// By primary key
$product = $entityManager->getRepository(Product::class)->find($id);

// By a column
$products = $entityManager->getRepository(Product::class)->findBy(['name' => 'Keyboard']);

// All
$products = $entityManager->getRepository(Product::class)->findAll();
```

### Automatically Fetching Objects (EntityValueResolver)

```php
use Symfony\Bridge\Doctrine\Attribute\MapEntity;

#[Route('/product/{id}', name: 'product_show')]
public function show(
    #[MapEntity] Product $product
): Response {
    return $this->render('product/show.html.twig', ['product' => $product]);
}

// With custom criteria
#[Route('/product/{slug}', name: 'product_show_slug')]
public function showBySlug(
    #[MapEntity(expr: 'repository.findOneBySlug(slug)')] Product $product
): Response { /* ... */ }
```

### Updating an Object

```php
$product = $entityManager->getRepository(Product::class)->find($id);
$product->setName('New name');
$entityManager->flush();
```

### Deleting an Object

```php
$product = $entityManager->getRepository(Product::class)->find($id);
$entityManager->remove($product);
$entityManager->flush();
```

### Querying with the Query Builder

```php
$productRepository = $entityManager->getRepository(Product::class);

$qb = $productRepository->createQueryBuilder('p')
    ->where('p.price > :price')
    ->setParameter('price', 50)
    ->orderBy('p.price', 'ASC')
    ->getQuery();

$products = $qb->getResult();
```

### Querying with DQL

```php
$dql = "SELECT p FROM App\Entity\Product p WHERE p.price > :price ORDER BY p.price ASC";
$query = $entityManager->createQuery($dql)
    ->setParameter('price', 50);

$products = $query->getResult();
```

### Querying with SQL

```php
$rsm = new ResultSetMappingBuilder($entityManager);
$rsm->addRootEntityFromClassMetadata(Product::class, 'p');

$query = $entityManager->createNativeQuery('SELECT * FROM products p WHERE p.price > :price', $rsm);
$query->setParameter('price', 50);
$products = $query->getResult();
```

### Relationships and Associations

```php
#[ORM\Entity]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category')]
    private Collection $products;
}

#[ORM\Entity]
class Product
{
    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;
}
```

### Database Testing

```php
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductRepositoryTest extends KernelTestCase
{
    public function testFindAll(): void
    {
        self::bootKernel();
        $products = static::getContainer()->get(ProductRepository::class)->findAll();
        $this->assertCount(5, $products);
    }
}
```

### Doctrine Extensions

Popular Doctrine extensions (via `stof/doctrine-extensions-bundle`):
- **Timestampable** — Auto-set created/updated dates
- **Sluggable** — Auto-generate slugs
- **Translatable** — Multi-language entities
- **Tree** — Hierarchical data
- **Sortable** — Reorderable entities
- **SoftDeletable** — Soft delete

## Forms

### Installation

```bash
composer require form
```

### Understanding How Forms Work

1. **Build** — Create form with fields
2. **Render** — Display form in template
3. **Process** — Handle submission, validate, persist

### Creating Form Classes

```php
namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Product Name',
                'required' => true,
            ])
            ->add('price', NumberType::class, [
                'scale' => 2,
            ])
            ->add('description', TextareaType::class, [
                'required' => false,
            ])
            ->add('save', SubmitType::class, ['label' => 'Save Product']);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
```

### Creating Forms in Controllers

```php
public function new(Request $request, EntityManagerInterface $entityManager): Response
{
    $product = new Product();
    $form = $this->createForm(ProductType::class, $product);

    $form->handleRequest($request);
    if ($form->isSubmitted() && $form->isValid()) {
        $entityManager->persist($product);
        $entityManager->flush();

        return $this->redirectToRoute('product_list');
    }

    return $this->render('product/new.html.twig', ['form' => $form]);
}
```

### Rendering Forms

```twig
{# templates/product/new.html.twig #}
{{ form_start(form) }}
    {{ form_widget(form) }}
{{ form_end(form) }}

{# Or with more control #}
{{ form_start(form, {'attr': {'class': 'form'}}) }}
    {{ form_row(form.name) }}
    {{ form_row(form.price) }}
    {{ form_row(form.description) }}
    {{ form_row(form.save) }}
{{ form_end(form) }}
```

### Processing Forms

```php
$form->handleRequest($request);

if ($form->isSubmitted() && $form->isValid()) {
    $product = $form->getData();
    // Persist...
}
```

### Passing Options to Forms

```php
$form = $this->createForm(ProductType::class, $product, [
    'action' => $this->generateUrl('product_new'),
    'method' => 'POST',
]);
```

### Form Type Guessing

Symfony guesses field types from Doctrine metadata and validation constraints:

```php
$builder->add('name'); // Guessed as TextType
$builder->add('price'); // Guessed as NumberType
$builder->add('description'); // Guessed as TextareaType
```

### Unmapped Fields

```php
$builder->add('termsAccepted', CheckboxType::class, [
    'mapped' => false,
    'constraints' => [new IsTrue(['message' => 'You must accept terms'])],
]);
```

### Handling Multiple Submit Buttons

```php
$builder
    ->add('save', SubmitType::class, ['label' => 'Save'])
    ->add('saveAndAdd', SubmitType::class, ['label' => 'Save and Add']);

// In controller
if ($form->get('saveAndAdd')->isClicked()) { /* ... */ }
```

### Form Events

```php
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;

$builder->addEventListener(FormEvents::PRE_SET_DATA, function (FormEvent $event) {
    $product = $event->getData();
    $form = $event->getForm();

    if (!$product || null === $product->getId()) {
        $form->add('name', TextType::class, ['required' => true]);
    }
});
```

### Form Themes

```twig
{# templates/form_theme.html.twig #}
{% extends 'form_div_layout.html.twig' %}

{% block form_row %}
    <div class="form-group">
        {{ form_label(form) }}
        {{ form_widget(form, {'attr': {'class': 'form-control'}}) }}
        {{ form_errors(form) }}
    </div>
{% endblock %}
```

```twig
{# Apply theme in template #}
{% form_theme form 'form_theme.html.twig' %}
```

## Validation

### Installation

```bash
composer require validator
```

### The Basics of Validation

```php
use Symfony\Component\Validator\Validator\ValidatorInterface;

public function validateProduct(Product $product, ValidatorInterface $validator): array
{
    $errors = $validator->validate($product);
    if (count($errors) > 0) {
        // Handle errors
    }
}
```

### Validation Constraints (Attributes)

```php
use Symfony\Component\Validator\Constraints as Assert;

class Product
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    private ?string $name = null;

    #[Assert\NotBlank]
    #[Assert\Positive]
    #[Assert\LessThan(value: 1000)]
    private ?float $price = null;

    #[Assert\Email]
    private ?string $contactEmail = null;

    #[Assert\Url]
    private ?string $website = null;

    #[Assert\NotBlank]
    #[Assert\Type(\DateTimeInterface::class)]
    private ?\DateTimeInterface $createdAt = null;
}
```

### Supported Constraints

#### Basic Constraints
- `NotBlank` — Must not be blank
- `Blank` — Must be blank
- `NotNull` — Must not be null
- `IsNull` — Must be null
- `Type` — Must be of a type
- `When` — Conditional validation

#### String Constraints
- `Email` — Valid email
- `Length` — String length
- `Url` — Valid URL
- `Regex` — Match regex pattern
- `Ulid` — Valid ULID
- `Uuid` — Valid UUID
- `Bic` — BIC code
- `Iban` — IBAN code
- `Isbn` — ISBN
- `Issn` — ISSN

#### Comparison Constraints
- `EqualTo` — Equal to value
- `NotEqualTo` — Not equal to value
- `IdenticalTo` — Identical to value
- `NotIdenticalTo` — Not identical to value
- `LessThan` — Less than value
- `LessThanOrEqual` — Less than or equal
- `GreaterThan` — Greater than value
- `GreaterThanOrEqual` — Greater than or equal
- `Range` — Within a range

#### Number Constraints
- `Positive` — Positive number
- `PositiveOrZero` — Positive or zero
- `Negative` — Negative number
- `NegativeOrZero` — Negative or zero

#### Date Constraints
- `Date` — Valid date
- `DateTime` — Valid datetime
- `Time` — Valid time

#### Choice Constraints
- `Choice` — Value in list
- `Language` — Valid language code
- `Locale` — Valid locale
- `Country` — Valid country code
- `Currency` — Valid currency code

#### File Constraints
- `File` — Valid file
- `Image` — Valid image file

#### Collection Constraints
- `Count` — Count items in collection
- `Unique` — Items must be unique
- `Collection` — Validate collection fields

#### Doctrine Constraints
- `Entity` — Entity exists
- `UniqueEntity` — Entity field is unique

### Constraint Configuration (YAML)

```yaml
# config/validator/validation.yaml
App\Entity\Product:
    properties:
        name:
            - NotBlank: ~
            - Length: { min: 3, max: 255 }
        price:
            - NotBlank: ~
            - Positive: ~
```

### Constraints in Form Classes

```php
public function configureOptions(OptionsResolver $resolver): void
{
    $resolver->setDefaults([
        'data_class' => Product::class,
        'constraints' => [
            new Assert\Callback(['callback' => 'validateCustom']),
        ],
    ]);
}
```

### Constraint Targets

- **Properties** — Validate property values
- **Getters** — Validate method return values (`getMethodName`)
- **Classes** — Validate the entire object (e.g., `UniqueEntity`, `Callback`)

### Validation Groups

```php
#[Assert\GroupSequence(['Product', 'strict'])]
class Product { /* ... */ }

// Or in controller
$validator->validate($product, null, ['Default', 'strict']);
```

### Custom Validation Constraints

```php
#[Attribute(Attribute::TARGET_PROPERTY | Attribute::TARGET_METHOD)]
class ContainsAlphanumeric extends Constraint
{
    public string $message = 'The string "{{ string }}" contains an illegal character.';
}
```

```php
class ContainsAlphanumericValidator extends ConstraintValidator
{
    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!preg_match('/^[a-zA-Z0-9]+$/', $value, $matches)) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ string }}', $value)
                ->addViolation();
        }
    }
}
```

### Debugging Constraints

```bash
php bin/console debug:validator App\Entity\Product
```
