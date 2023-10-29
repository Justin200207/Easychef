from django.db import models
from django.core.exceptions import ValidationError

from accounts.models import User

"""
########################################################################################################
Structure of Recipe:
"Moreover, I can add one or more photos/videos, prep time and cooking time to specific steps or to the overall recipe."
Recipe  1 -> M RecipeImg
        1 -> M RecipeStep 1 -> M RecipeImage
        1 -> M Comments 1 -> M CommentImage
"""
class Ingredient(models.Model):
    name = models.CharField(max_length=500)

class Diet(models.Model):
    name = models.CharField(max_length=500)

class Recipe(models.Model):
    
    # "my_recipes" is the name that can be used from User's perspective
    # no cascade for this, similar to how a reddit post works
    owner = models.ForeignKey(to=User, related_name='my_recipes', on_delete=models.SET_NULL, null=True)
    
    name = models.CharField(max_length=100, blank=False, null=False)
    
    rating = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)
    
    fav_counter = models.IntegerField(default=0)
    
    # Detail fields
    diets = models.ManyToManyField(Diet)
    cuisine = models.CharField(max_length=500, blank=True)
    serving = models.IntegerField()
    
    # Steps or the overall recipe can have theses two
    prep_time = models.IntegerField(null=True, blank=True)
    cooking_time = models.IntegerField(null=True, blank=True)
    
    recipe_thumbnail = models.ImageField(upload_to="recipes/thumbnails/", blank=True, null=True)

class RecipeToIng(models.Model):
    
    recipe = models.ForeignKey(to=Recipe, related_name='ingredients', on_delete=models.SET_NULL, null=True)
    
    ingredient = models.ForeignKey(to=Ingredient, related_name='ing_recipes', on_delete=models.SET_NULL, null=True)
    
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=False, null=True)
    
    measure_type = models.CharField(max_length=10, blank=False, null=True)
    

class RecipeImage(models.Model):
    
    recipe = models.ForeignKey(to=Recipe, related_name='recipe_images', on_delete=models.SET_NULL, null=True)
    
    recipe_image = models.ImageField(upload_to="recipes/imgs/", blank=True, null=True)
    
    
class RecipeStep(models.Model):
    
    recipe = models.ForeignKey(to=Recipe, related_name='steps', on_delete=models.CASCADE, null=True)
    
    text = models.CharField(max_length=5000, null=True, blank=True)
    
    # Steps or the overall recipe can have theses two
    prep_time = models.IntegerField(null=True, blank=True)
    cooking_time = models.IntegerField(null=True, blank=True)
    

class RecipeStepImage(models.Model):
    
    recipe_step = models.ForeignKey(to=RecipeStep, related_name='step_images', on_delete=models.SET_NULL, null=True, blank=True)
    
    step_image = models.ImageField(upload_to="recipes/step_imgs/", blank=True, null=True)
    
    
class RecipeComment(models.Model):
    
    recipe = models.ForeignKey(to=Recipe, related_name='comments', on_delete=models.CASCADE, null=True)
    
    owner = models.ForeignKey(to=User, related_name='user_comments', on_delete=models.SET_NULL, null=True)
    
    text = models.CharField(max_length=5000)
    
    
class RecipeCommentImage(models.Model):
    
    comment = models.ForeignKey(to=RecipeComment, related_name="comment_images", on_delete=models.SET_NULL, null=True)
    
    comment_image = models.ImageField(upload_to="recipes/comment_imgs/", blank=True, null=True)
    
    

"""
########################################################################################################
RELATIONs for attaching a user to recipes in different ways
No relation needed for "recipes I created", that is <owner> in the Recipe Model
"""

# For the rating field in RatingList
def validate_rating_range(value):
    if value >= 1 and value <= 5:
        return value
    else:
        return ValidationError("Rating must be an int from 1 to 5 inclusive")

# A list for all recipes that are rated by a user in not needed
# But, there needs to be a way to track each user's rating for recipes
class RatingList(models.Model):
    
    owner = models.ForeignKey(to=User, related_name='ratings', on_delete=models.CASCADE, null=True)
    
    rating = models.IntegerField(validators=[validate_rating_range])
    
    recipe = models.ForeignKey(to=Recipe, related_name='ratings_owner', on_delete=models.SET_NULL, null=True)

class ShoppingList(models.Model):
    
    # "shopping_list" is the name that can be used from User's perspective
    # no reason to keep list around when user is gone, cascade
    owner = models.ForeignKey(to=User, related_name='shopping_list', on_delete=models.CASCADE, null=True)
    
    # realted_name should never be used since shopping lists will be accessed from the User foreign key
    recipe = models.ForeignKey(to=Recipe, related_name='shopping_users', on_delete=models.SET_NULL, null=True)
    
class FavouriteList(models.Model):
    
    owner = models.ForeignKey(to=User, related_name='favourite_list', on_delete=models.CASCADE, null=True)
    
    recipe = models.ForeignKey(to=Recipe, related_name='favourite_users', on_delete=models.SET_NULL, null=True)
    
class HistoryList(models.Model):
    
    owner = models.ForeignKey(to=User, related_name='history_list', on_delete=models.CASCADE, null=True)
    
    # auto_now updates the time everytime save() is called (every time the user visits the recipe)
    datetime_viewed = models.DateTimeField(auto_now=True, auto_now_add=False)
    
    interaction = models.CharField(max_length=100, default="view")
    
    recipe =   models.ForeignKey(to=Recipe, related_name='history_users', on_delete=models.CASCADE, null=True)
    
"""
########################################################################################################
"""
    
