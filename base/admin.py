from django.contrib import admin

from .models import Product, Order, Review, OrderItem, ShippingAddress
# Register your models here.

class ProductAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user', 'name', 'brand', 'category', 'price', 'countInStock', 'isPublished']
    list_display_links = ['_id', 'name']
    list_editable = ['isPublished']
    list_filter = ['user', 'brand', 'category']
    search_fields = ['user', 'name', 'brand', 'category']
    list_per_page = 30

class OrderAdmin(admin.ModelAdmin):
    list_display = ['_id', 'user', 'total_price', 'paymentMethod', 'isPaid', 'isDelivered', 'created_date']
    list_display_links = ['user']
    list_filter = ['user', 'isPaid', 'isDelivered']
    search_fields = ['user', 'isPaid', 'isDelivered']
    list_per_page = 50

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['_id', 'name', 'qty', 'price', 'get_total_price']
    list_display_links = ['_id', 'name']
    list_filter = ['name']

    def get_total_price(self, obj):
        return obj.price * obj.quantity

admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Review)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(ShippingAddress)