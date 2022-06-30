from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from base.models import Review

def updateUser(sender, instance, **kwargs) -> None:
    user = instance
    if user.email != '':
        user.username = user.email

def updateReviewRating(sender, instance, **kwargs) -> None:
    reviews = instance.product.review_set.all()
    ratings = [r.rating for r in reviews]

    instance.product.numReviews = len(reviews)
    instance.product.rating = sum(ratings) / len(reviews)
    
    instance.product.save()


pre_save.connect(updateUser, sender=User, dispatch_uid="update_user_identifier")
post_save.connect(updateReviewRating, sender=Review, dispatch_uid="update_rating_identifier")