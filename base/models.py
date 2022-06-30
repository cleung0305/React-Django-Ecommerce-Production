from django.db import models
from django.contrib.auth.models import User
# from django.utils import timezone

# Create your models here.
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name='Employee')
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(null=True, blank=True, default='/sample.jpg')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, default=0)
    numReviews = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    isPublished = models.BooleanField(default=True, verbose_name='Published')
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.name)

    def get_rating(self):
        pass

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, default=0)
    comment = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return str(self.product)

#Order Manager
# class OrderManager(models.Manager):
#     def get_queryset(self):
#         return super().get_queryset().exclude(
#             created_date__lte=timezone.now()-timezone.timedelta(days=14),
#             isPaid=False
#         )

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    subtotal_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    tax_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    total_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    isPaid = models.BooleanField(default=False, verbose_name='Paid')
    paid_date = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(default=False, verbose_name='Delivered')
    deliverd_date = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True, editable=False)
    #objects = OrderManager()

    def __str__(self):
        return f'${self.user.username} created at ${self.created_date}'

class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField()
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.name

class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    street_address = models.CharField(max_length=200)
    apt_address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip = models.CharField(max_length=20)
    shipping_price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0)
    _id = models.AutoField(primary_key=True, editable=False)

    def __str__(self):
        return self.street_address