from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path('add/', views.addOrderItems, name="add-orders"),
    path('myorders/', views.getMyOrders, name="my-orders"),
    path('<str:pk>/', views.getOrderById, name="get-order"),
    path('<str:pk>/pay/', views.updateOrderToPaid, name="update-order-paid"),
    path('<str:pk>/deliver/', views.updateOrderToDelivered, name="update-order-delivered"),

    path('admin/all-orders/', views.getOrders, name="get-all-orders"),
]
