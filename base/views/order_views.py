# rest imports
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import ProductSerializer, OrderSerializer

from datetime import datetime
from django.utils import timezone

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data
    
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        message = {'detail': 'No Order Item'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST) #Error when no item in cart
    else:
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            subtotal_price=data['subtotalPrice'],
            tax_price=data['taxPrice'],
            shipping_price=data['shippingPrice'],
            total_price=data['totalPrice'],
        )

        if (data['shippingAddress']['aptAddress'] != ""):
            apt_address = data['shippingAddress']['aptAddress']
        else:
            apt_address = ""

        shipping = ShippingAddress.objects.create(
            order=order,
            name=data['shippingAddress']['name'],
            street_address=data['shippingAddress']['streetAddress'],
            apt_address=apt_address,
            city=data['shippingAddress']['city'],
            state=data['shippingAddress']['state'],
            zip=data['shippingAddress']['zip'],
            shipping_price=data['shippingPrice'],
        )

        for item in orderItems:
            product = Product.objects.get(_id=item['productId'])
            orderItem = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image.url,
            )

        order.save()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.exclude( #show only paid orders, **Orders those aren't paid and older than 14days are excluded**
        created_date__lte=timezone.now()-timezone.timedelta(days=14),
        isPaid=False
    )
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    order = Order.objects.get(_id=pk)

    try:
        if order.user == user or user.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            message = {'detail': 'Not authorized to view this order'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except:
        message = {'detail': 'Order with this order number does not exist'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(_id=pk)
    orderItems = order.orderitem_set.all()
    for orderItem in orderItems:
        product = Product.objects.get(_id=orderItem.product._id)
        product.countInStock -= orderItem.qty
        product.save()

    order.isPaid = True
    order.paid_date = datetime.now()
    order.save()
    return Response('Order paid')

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request, pk):
    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliverd_date = datetime.now()
    order.save()
    return Response('Order delivered')