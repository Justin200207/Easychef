from rest_framework import serializers
from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.exceptions import PermissionDenied

from accounts.models import User
from accounts.serializers import UserSerializer
from recipe.models import *

def update_history(recipe, user, interaction: str) -> None:
    # History is only added to when user is logged in, avoid error otherwise
    try:
        # Delete the old history for that viewing
        HistoryList.objects.filter(recipe = recipe, owner = user).delete()
        HistoryList.objects.create(recipe = recipe, owner = user, interaction=interaction)
    except (ValueError, TypeError):
        pass

"""
################################################################################
IMAGE Serializers
"""

class RecipeCommentImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RecipeCommentImage
        fields = ['id', 'comment', 'comment_image']
        extra_kwargs = {
            'comment_image': {'required': True},
            'comment': {'read_only': True}
        }
        
class RecipeStepImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RecipeStepImage
        fields = ['id', 'recipe_step', 'step_image']
        extra_kwargs = {
            'step_image': {'required': True},
            'recipe_step': {'read_only': True}
        }
        
class RecipeImageSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = RecipeImage
        fields = ['id', 'recipe', 'recipe_image']
        extra_kwargs = {
            'recipe_image': {'required': True},
            'recipe': {'read_only': True}
        }


"""
################################################################################
Recipe Related Serializers
"""

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name']


        
class RecipeToIngSerializer(serializers.ModelSerializer):
    ingredient = IngredientSerializer()
    
    class Meta:
        model = RecipeToIng
        fields = ['id', 'recipe', 'ingredient', 'quantity', 'measure_type']

class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        fields = ['name']

class RecipeCommentSerializer(serializers.ModelSerializer):
    
    owner = UserSerializer(read_only=True, required=False)
    
    comment_images = RecipeCommentImageSerializer(read_only=True, many=True)
    add_comment_images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    
    class Meta:
        model = RecipeComment
        fields = ['id', 'recipe', 'owner', 'text', 'comment_images', 'add_comment_images']
        
    def create(self, validated_data):
        
        # Set Owner
        validated_data['owner'] = self.context['request'].user
        
        # Set Recipe
        this_recipe_id = self.context.get('view').kwargs.get('id')
        this_recipe = Recipe.objects.get(id=this_recipe_id)
        validated_data['recipe'] = this_recipe
        
        try:
            new_comment_images = validated_data.pop('add_comment_images')
        except KeyError:
            new_comment_images = []
        new_comment = RecipeComment.objects.create(**validated_data)
        
        for new_comment_img in new_comment_images:
            comm_img = get_object_or_404(RecipeCommentImage, id=new_comment_img)
            if comm_img.comment is None:
                comm_img.comment = new_comment
                comm_img.save()
                
        update_history(this_recipe, self.context['request'].user, "commented")
        
        return new_comment


class RecipeStepSerializer(serializers.ModelSerializer):
    step_images = RecipeStepImageSerializer(read_only=True, many=True, required=False)
    add_step_images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    
    class Meta:
        model = RecipeStep
        fields = ['id', 'recipe', 'text', 'prep_time', 'cooking_time', 'step_images', 'add_step_images']
        
    def create(self, validated_data):
        
        try:
            new_step_images = validated_data.pop('add_step_images')
        except KeyError:
            new_step_images = []
        new_step = RecipeStep.objects.create(**validated_data)
        
        for new_step_img in new_step_images:
            step_img = get_object_or_404(RecipeStepImage, id=new_step_img)
            if step_img.recipe_step is None:
                step_img.recipe_step = new_step
                step_img.save()
        
        return new_step
        

class RecipeSerializer(serializers.ModelSerializer):
    
    owner = UserSerializer(read_only=True, required=False)
    
    ingredients = RecipeToIngSerializer(many=True)
    diets = DietSerializer(many=True)
    
    steps = RecipeStepSerializer(many=True)
    
    recipe_images = RecipeImageSerializer(read_only=True, many=True, required=False)
    add_recipe_images = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
    )
    
    comments = RecipeCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Recipe
        fields = ['id', 'owner', 'name', 'rating', 'fav_counter',
                  'diets', 
                  'cuisine', 
                  'ingredients', 
                  'serving', 
                  'prep_time', 'cooking_time', 
                  'recipe_thumbnail', 
                  'steps',
                  'add_recipe_images', 'recipe_images',
                  'comments']
        extra_kwargs = {
            'rating': {'read_only': True},
            'fav_counter': {'read_only': True}
        }
        
    def create(self, validated_data):
        # Auto assign the owner to the current user
        validated_data['owner'] = self.context['request'].user
        
        # Must be done before the recipe is created
        new_steps = validated_data.pop('steps')
        try:
            new_recipe_images = validated_data.pop('add_recipe_images')
        except KeyError:
            new_recipe_images = []
        ings = validated_data.pop('ingredients')
        diets = validated_data.pop('diets')
        
        new_recipe = Recipe.objects.create(**validated_data)

        for d in diets:
            new_recipe.diets.add(Diet.objects.get_or_create(name=d["name"])[0])

        for i in ings:
            ing_name = i.pop('ingredient')
            temp_name = ing_name.pop('name')
            temp_name = temp_name.lower() # all ingredients will be lower case
            new_ing = Ingredient.objects.get_or_create(name=temp_name)[0]
            RecipeToIng.objects.create(recipe=new_recipe, ingredient=new_ing, **i)
        
        for new_step in new_steps:
            try:
                new_step_imgs = new_step.pop('add_step_images')
            except KeyError:
                new_step_imgs = []
            temp_step = RecipeStep.objects.create(recipe=new_recipe, **new_step)
            
            for new_step_img in new_step_imgs:
                step_img = get_object_or_404(RecipeStepImage, id=new_step_img)
                if step_img.recipe_step is None:
                    step_img.recipe_step = temp_step
                    step_img.save()
        
        for new_recipe_img in new_recipe_images:
            rec_img = get_object_or_404(RecipeImage, id=new_recipe_img)
            if rec_img.recipe is None:
                rec_img.recipe = new_recipe
                rec_img.save()
        
        update_history(new_recipe, self.context['request'].user, "created")
        
        return new_recipe
    
    def update(self, instance, validated_data):
        
        this_recipe_id = self.context.get('view').kwargs.get('id')
        this_recipe = Recipe.objects.get(id=this_recipe_id)
        
        print(this_recipe)
        
        try:
            new_diets = validated_data.pop('diets')
        except KeyError:
            new_diets = []
        if len(new_diets) > 0:
            this_recipe.diets.clear() # Do not delete the diets, used for other recipes
            for new_diet in new_diets:
                this_recipe.diets.add(Diet.objects.get_or_create(name=new_diet["name"])[0])
            
        old_recipetoings = RecipeToIng.objects.filter(recipe=this_recipe_id)  
        try:
            new_ings = validated_data.pop('ingredients')
        except KeyError:
            new_ings = []
            
        old_recipetoings.delete()
        for i in new_ings:
            try:
                i.pop('recipe')
            except:
                pass
            ing_name = i.pop('ingredient')
            temp_name = ing_name.pop('name')
            temp_name = temp_name.lower() # all ingredients will be lower case
            new_ing = Ingredient.objects.get_or_create(name=temp_name)[0]
            RecipeToIng.objects.create(recipe=this_recipe, ingredient=new_ing, **i)
        
        # If there are new steps, delete any possible old ones and add the new
        old_steps = RecipeStep.objects.filter(recipe=this_recipe_id)
        try:
            new_steps = validated_data.pop('steps')
        except KeyError:
            new_steps = []
            
        old_steps.delete()
        for new_step in new_steps:
            try:
                new_step.pop('recipe')
            except:
                pass
            try:
                new_step_imgs = new_step.pop('add_step_images')
            except KeyError:
                new_step_imgs = []
            temp_step = RecipeStep.objects.create(recipe=this_recipe, **new_step)
            
            for new_step_img in new_step_imgs:
                step_img = get_object_or_404(RecipeStepImage, id=new_step_img)
                if step_img.recipe_step is None:
                    step_img.recipe_step = temp_step
                    step_img.save()
        
        # Do the same with recipe images
        old_images = RecipeImage.objects.filter(recipe=this_recipe_id)
        try:
            new_images = validated_data.pop('add_recipe_images')
        except KeyError:
            new_images = []
        # Un-assign all images from the recipe
        for old_img in old_images:
            old_img.recipe = None
            old_img.save()
        for new_recipe_img in new_images:
            rec_img = get_object_or_404(RecipeImage, id=new_recipe_img)
            if rec_img.recipe is None:
                rec_img.recipe = this_recipe
                rec_img.save()
        
        return super().update(instance, validated_data)
        
class FavouriteSerializer(serializers.ModelSerializer):
    recipe = serializers.IntegerField(write_only=True)
    rec_ob = RecipeSerializer(read_only=True, source="recipe")

    class Meta:
        model = FavouriteList
        fields = ['owner', 'recipe', 'rec_ob']


    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user

        temp_recipe = get_object_or_404(Recipe, id=validated_data["recipe"])
        temp_recipe.fav_counter = temp_recipe.fav_counter + 1
        temp_recipe.save()

        validated_data['recipe'] = temp_recipe
        
        new, created = FavouriteList.objects.get_or_create(**validated_data)
        if created:
            update_history(temp_recipe, self.context['request'].user, "favourited")
            return new
        raise Http404

class HistorySerializer(serializers.ModelSerializer):
    rec_ob = RecipeSerializer(read_only=True, source="recipe")
    class Meta:
        model = HistoryList
        fields = ['owner', 'datetime_viewed', 'interaction', 'recipe', 'rec_ob']
    
class ShoppingListSerializer(serializers.ModelSerializer):
    rec_ob = RecipeSerializer(read_only=True, source="recipe")
    class Meta:
        model = ShoppingList
        fields = ['owner', 'recipe', 'rec_ob']
        
    def create(self, validated_data):
        # Auto assign the owner to the current user
        validated_data['owner'] = self.context['request'].user
        return ShoppingList.objects.get_or_create(**validated_data)[0]
        

class RatingListSerializer(serializers.ModelSerializer):
    recipe = serializers.IntegerField(write_only=True)
    class Meta:
        model = RatingList
        fields = ['recipe', 'rating']

    def create(self, validated_data):
        if not(1 <= self.validated_data['rating'] <= 5):
            raise PermissionDenied({"406":"Rating must be between 1 and 5 "})
        
        recipe = get_object_or_404(Recipe, id=validated_data["recipe"])

        try:
            RatingList.objects.filter(owner=self.context['request'].user, recipe=recipe).delete()
        except:
            pass

        new_rating = RatingList.objects.create(owner=self.context['request'].user, recipe=recipe, rating = self.validated_data['rating'])

        recipes = RatingList.objects.filter(recipe=recipe)

        num_ratings = recipes.count()

        sum_recipes = 0
        for r in recipes:
            sum_recipes += r.rating

        recipe.rating = round(sum_recipes / num_ratings, 1)
        recipe.save()
        
        update_history(recipe, self.context['request'].user, "rated")

        return new_rating