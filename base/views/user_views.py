from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

# rest imports
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.views import APIView

from base.serializers import UserSerializer, UserSerializerWithToken
from base.auth.services import google_validate_aud, user_get_or_create

# SimpleJWT imports
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import MyTokenObtainPairSerializer

# Create your views here.

#Google Login view
class GoogleLoginView(APIView):
    class InputSerializer(serializers.Serializer):
        email = serializers.EmailField()
        first_name = serializers.CharField(required=False, default='')
        last_name = serializers.CharField(required=False, default='')
    
    def post(self, request, *args, **kwargs):
        access_token = request.headers.get('Authorization') # get the google api access token, no particular use here, save for later development
        data = request.data
        aud = data['aud']
        google_validate_aud(aud=aud) # validate the client id recieved with the client id in backend

        serializer = self.InputSerializer(data=request.data, many=False)
        serializer.is_valid(raise_exception=True)

        user, _ = user_get_or_create(**serializer.validated_data) # check if user exist, if not, create one

        user_serializer = UserSerializerWithToken(user, many=False)
        return Response(user_serializer.data)

class MyTokenObtainPairView(TokenObtainPairView): #Customize JWT token View
    serializer_class = MyTokenObtainPairSerializer #Initialize the Token serializer

@api_view(['POST'])
def registerUser(request) -> Response:
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email address already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request) -> Response: # Update your user profile
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request, pk) -> Response: # Checkout your user profile
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request) -> Response: # get all users in the database
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUserById(request, pk) -> Response: # get a user by its ID
    user = User.objects.get(id=pk)
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk) -> Response: # update a user profile by ID
    user = User.objects.get(id=pk)

    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']
    user.is_staff = data['isAdmin']

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk) -> Response:
    userToDelete = User.objects.get(id=pk)
    if userToDelete.is_staff:
        message = {'detail': 'You cannot delete an admin user directly'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    else:
        userName = userToDelete.first_name
        userToDelete.delete()
        return Response(f'User {userName} has been deleted')