# Forms — Django 6.0

## Django's Role in Forms

Django handles three parts of form work:
1. Preparing and restructuring data for rendering
2. Creating HTML forms for the data
3. Receiving and processing submitted forms and data from the client

## Form Class

```python
from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={"class": "form-control"}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={"class": "form-control"}))
    message = forms.CharField(widget=forms.Textarea(attrs={"rows": 4, "class": "form-control"}))
    cc_myself = forms.BooleanField(required=False)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if not email.endswith("@example.com"):
            raise forms.ValidationError("Please use an @example.com email address.")
        return email

    def clean(self):
        cleaned_data = super().clean()
        name = cleaned_data.get("name")
        message = cleaned_data.get("message")
        if name and message and name.lower() in message.lower():
            raise forms.ValidationError("Message should not contain your name.")
        return cleaned_data
```

## Using Forms in Views

```python
from django.shortcuts import render
from .forms import ContactForm

def contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            # Process the data
            name = form.cleaned_data["name"]
            email = form.cleaned_data["email"]
            message = form.cleaned_data["message"]
            # Send email, save to DB, etc.
            return redirect("success")
    else:
        form = ContactForm()

    return render(request, "contact.html", {"form": form})
```

## Rendering Forms in Templates

```html
<form method="post">
    {% csrf_token %}
    {{ form.as_p }}
    {# or: {{ form.as_table }} #}
    {# or: {{ form.as_ul }} #}
    <button type="submit">Submit</button>
</form>
```

### Field-by-Field Rendering

```html
<form method="post">
    {% csrf_token %}
    <div class="form-group">
        {{ form.name.label_tag }}
        {{ form.name }}
        {% if form.name.errors %}
            {{ form.name.errors }}
        {% endif %}
    </div>
    <div class="form-group">
        {{ form.email.label_tag }}
        {{ form.email }}
        {% if form.email.errors %}
            {{ form.email.errors }}
        {% endif %}
    </div>
    <button type="submit">Submit</button>
</form>
```

### Looping Over Fields

```html
<form method="post">
    {% csrf_token %}
    {% for field in form %}
        <div class="form-group">
            {{ field.label_tag }}
            {{ field }}
            {% if field.errors %}
                <div class="errors">{{ field.errors }}</div>
            {% endif %}
            {% if field.help_text %}
                <small class="form-text">{{ field.help_text }}</small>
            {% endif %}
        </div>
    {% endfor %}
    <button type="submit">Submit</button>
</form>
```

## ModelForm

```python
from django import forms
from .models import Article

class ArticleForm(forms.ModelForm):
    class Meta:
        model = Article
        fields = ["title", "content", "published", "category"]
        # or: exclude = ["author", "created_at"]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "content": forms.Textarea(attrs={"rows": 10, "class": "form-control"}),
            "published": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }
        labels = {
            "title": "Article Title",
            "content": "Content Body",
        }
        help_texts = {
            "title": "Enter a descriptive title.",
        }
        error_messages = {
            "title": {
                "max_length": "Title is too long.",
            },
        }
```

### ModelForm in Views

```python
def article_create(request):
    if request.method == "POST":
        form = ArticleForm(request.POST)
        if form.is_valid():
            article = form.save(commit=False)
            article.author = request.user
            article.save()
            form.save_m2m()  # If M2M fields exist
            return redirect("article-detail", pk=article.pk)
    else:
        form = ArticleForm()
    return render(request, "article_form.html", {"form": form})

def article_update(request, pk):
    article = get_object_or_404(Article, pk=pk)
    if request.method == "POST":
        form = ArticleForm(request.POST, instance=article)
        if form.is_valid():
            form.save()
            return redirect("article-detail", pk=article.pk)
    else:
        form = ArticleForm(instance=article)
    return render(request, "article_form.html", {"form": form})
```

## Form Fields Reference

```python
# String fields
forms.CharField(max_length=100, strip=True, empty_value="")
forms.EmailField(max_length=254)
forms.URLField(max_length=200)
forms.SlugField(max_length=50, allow_unicode=False)
forms.UUIDField()
forms.RegexField(regex=r"^[A-Za-z]+$")
forms.TextInput()
forms.Textarea()
forms.PasswordInput(render_value=False)

# Numeric fields
forms.IntegerField(min_value=0, max_value=100)
forms.FloatField(min_value=0.0)
forms.DecimalField(max_digits=10, decimal_places=2)
forms.NumberInput()

# Boolean
forms.BooleanField(required=False)
forms.NullBooleanField()
forms.CheckboxInput()

# Choice fields
forms.ChoiceField(choices=[("a", "A"), ("b", "B")])
forms.TypedChoiceField(choices=[...], coerce=int)
forms.MultipleChoiceField(choices=[...])
forms.TypedMultipleChoiceField(choices=[...], coerce=int)
forms.ModelChoiceField(queryset=Model.objects.all())
forms.ModelMultipleChoiceField(queryset=Model.objects.all())
forms.Select()
forms.SelectMultiple()
forms.RadioSelect()
forms.CheckboxSelectMultiple()

# Date/Time fields
forms.DateField(input_formats=["%Y-%m-%d"])
forms.TimeField(input_formats=["%H:%M"])
forms.DateTimeField(input_formats=["%Y-%m-%d %H:%M"])
forms.DurationField()
forms.DateInput()
forms.TimeInput()
forms.DateTimeInput()

# File fields
forms.FileField()
forms.ImageField()
forms.FileInput()
forms.ClearableFileInput()

# Other
forms.EmailField()
forms.GenericIPAddressField(protocol="both")
forms.JSONField()
forms.UUIDField()
forms.SplitDateTimeField()
```

## Widgets

```python
# Built-in widgets
forms.TextInput(attrs={"class": "form-control", "placeholder": "Enter text"})
forms.Textarea(attrs={"rows": 4})
forms.NumberInput(attrs={"min": 0, "max": 100})
forms.EmailInput(attrs={"placeholder": "user@example.com"})
forms.URLInput()
forms.PasswordInput(render_value=False)
forms.HiddenInput()
forms.DateInput(attrs={"type": "date"})
forms.TimeInput(attrs={"type": "time"})
forms.DateTimeInput(attrs={"type": "datetime-local"})
forms.CheckboxInput()
forms.Select()
forms.SelectMultiple()
forms.RadioSelect()
forms.CheckboxSelectMultiple()
forms.FileInput()
forms.ClearableFileInput()
forms.SplitDateTimeWidget()
forms.MultiWidget()

# Custom widget
class CustomWidget(forms.Widget):
    template_name = "widgets/custom.html"

    def get_context(self, name, value, attrs):
        return {"widget": {
            "name": name,
            "value": value,
            "attrs": attrs,
            "type": "custom",
        }}
```

## Formsets

```python
from django.forms import formset_factory

ArticleFormSet = formset_factory(ArticleForm, extra=3, can_delete=True)

def manage_articles(request):
    if request.method == "POST":
        formset = ArticleFormSet(request.POST)
        if formset.is_valid():
            for form in formset:
                if form.cleaned_data and not form.cleaned_data.get("DELETE"):
                    form.save()
            return redirect("success")
    else:
        formset = ArticleFormSet()
    return render(request, "manage_articles.html", {"formset": formset})
```

### ModelFormset

```python
from django.forms import modelformset_factory

ArticleFormSet = modelformset_factory(
    Article,
    fields=["title", "content"],
    extra=3,
    can_delete=True,
)
```

### Inline Formsets

```python
from django.forms import inlineformset_factory

BookFormSet = inlineformset_factory(
    Author,
    Book,
    fields=["title", "pages"],
    extra=2,
    can_delete=True,
)

def manage_books(request, author_pk):
    author = get_object_or_404(Author, pk=author_pk)
    if request.method == "POST":
        formset = BookFormSet(request.POST, instance=author)
        if formset.is_valid():
            formset.save()
            return redirect("author-detail", pk=author.pk)
    else:
        formset = BookFormSet(instance=author)
    return render(request, "manage_books.html", {"formset": formset, "author": author})
```

## Validation

```python
class MyForm(forms.Form):
    field = forms.CharField()

    # Field-level validation
    def clean_field(self):
        data = self.cleaned_data["field"]
        if "bad" in data:
            raise forms.ValidationError("Field contains 'bad'.")
        return data

    # Form-level validation
    def clean(self):
        cleaned_data = super().clean()
        field1 = cleaned_data.get("field1")
        field2 = cleaned_data.get("field2")
        if field1 and field2 and field1 == field2:
            raise forms.ValidationError("Fields must be different.")
        return cleaned_data
```

## Bound and Unbound Forms

```python
# Unbound (no data) — for display
form = ContactForm()

# Bound (has data) — for validation
form = ContactForm(request.POST)

# Check if bound
form.is_bound  # True or False

# Check validity
form.is_valid()  # Returns True/False, populates cleaned_data and errors

# Access errors
form.errors  # dict of field → error list
form.errors.as_data()  # Validation error objects
form.errors.as_json()  # JSON string
form.non_field_errors()  # Form-level errors
form[field_name].errors  # Field-specific errors
```

## Form Assets (Media)

```python
class ContactForm(forms.Form):
    class Media:
        css = {
            "all": ("pretty.css",),
            "screen": ("layout.css",),
        }
        js = ("animations.js", "actions.js")

# In template:
# {{ form.media }}
```
