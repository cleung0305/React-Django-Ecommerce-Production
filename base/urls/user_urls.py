from django.urls import path
from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('google/', views.GoogleLoginView.as_view(), name='google-login'),
    path('register/', views.registerUser, name='register-user'),
    path('profile/<str:pk>', views.getUserProfile, name="get-users-profile"),
    path('profile/update/', views.updateUserProfile, name="update-users-profile"),

    # admin urls
    path('admin/all-users/', views.getUsers, name="get-all-users"),
    path('admin/user/<str:pk>/', views.getUserById, name="get-user-by-id"),
    path('admin/delete-user/<str:pk>/', views.deleteUser, name="delete-user"),
    path('admin/update-user/<str:pk>/', views.updateUser, name="update-user"),
]
