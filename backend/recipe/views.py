from django.shortcuts import render, get_object_or_404, get_list_or_404
from rest_framework.generics import RetrieveAPIView, ListAPIView, CreateAPIView, UpdateAPIView, RetrieveUpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied

from recipe.models import *
from recipe.serializers import *

# Create your views here.

def update_history(recipe, user, interaction: str) -> None:
    # History is only added to when user is logged in, avoid error otherwise
    try:
        # Delete the old history for that viewing
        HistoryList.objects.filter(recipe = recipe, owner = user).delete()
        HistoryList.objects.create(recipe = recipe, owner = user, interaction=interaction)
    except (ValueError, TypeError):
        pass

class NewRecipeView(CreateAPIView): 
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    
class RecipeView(RetrieveAPIView): 
    serializer_class = RecipeSerializer
    
    def get_object(self):
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        
        update_history(recipe, self.request.user, "view")
        
        return recipe
    
class FavouriteAddAPIView(CreateAPIView): # WORKS
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]
    
class RemoveFavAPIView(DestroyAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]
    
    # manually get the recipe number from the json
    def get_object(self):
        recipe_obj = get_object_or_404(Recipe, id=self.kwargs['id'])
        fav = get_object_or_404(FavouriteList, owner=self.request.user, recipe=recipe_obj)
        recipe_obj.fav_counter = recipe_obj.fav_counter - 1
        recipe_obj.save()
        return fav

class ShoppingListAddAPIView(CreateAPIView): # WORKS
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]
    
class RemoveShopAPIView(DestroyAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]
    
    # manually get the recipe number from the json
    def get_object(self):
        recipe_obj = get_object_or_404(Recipe, id=self.kwargs['id'])
        shop = get_object_or_404(ShoppingList, owner=self.request.user, recipe=recipe_obj)
        return shop

class RatingListAddAPIView(CreateAPIView): #WORKS
    serializer_class = RatingListSerializer
    permission_classes = [IsAuthenticated]
    
class RatingAPIView(RetrieveAPIView): #WORKS
    serializer_class = RatingListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        recipe = get_object_or_404(Recipe, id=self.kwargs['id'])
        rating = get_object_or_404(RatingList, owner = self.request.user, recipe=recipe)
        return rating

class SearchAPIView(ListAPIView): # WORKS
    serializer_class = RecipeSerializer

    def get_queryset(self):
        queryset = Recipe.objects.all()

        if self.request.query_params.get('name') != None:
            queryset = queryset.filter(name__icontains=self.request.query_params.get('name'))

        if self.request.query_params.get('owner') != None:
            queryset = queryset.filter(owner__first_name__icontains=self.request.query_params.get('owner'))

        if self.request.query_params.get('ingredient') != None:
            queryset = queryset.filter(ingredients__ingredient__name__icontains=self.request.query_params.get('ingredient'))

        if self.request.query_params.get('diet') != None:
            print("here")
            queryset = queryset.filter(diets__name__icontains=self.request.query_params.get('diet'))

        if self.request.query_params.get('cuisine') != None:
            queryset = queryset.filter(cuisine__icontains=self.request.query_params.get('cuisine'))
  
        if self.request.query_params.get('mpt') != None:
            queryset = queryset.filter(prep_time__lte=self.request.query_params.get('mpt'))

        if self.request.query_params.get('lpt') != None:
            queryset = queryset.filter(prep_time__gte=self.request.query_params.get('lpt'))

        if self.request.query_params.get('mct') != None:
            queryset = queryset.filter(cook_time__lte=self.request.query_params.get('mct'))

        if self.request.query_params.get('lct') != None:
            queryset = queryset.filter(cook_time__gte=self.request.query_params.get('lct'))
        
        return queryset.order_by('-rating', '-fav_counter')
    
class MyCreationAPIView(ListAPIView): # WORKS
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Recipe.objects.filter(owner_id=self.request.user.id)
    
class FavouritedAPIView(ListAPIView): # WORKS
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FavouriteList.objects.filter(owner_id=self.request.user.id)
    
class CheckFavouriteView(RetrieveAPIView):
    serializer_class = FavouriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(FavouriteList, owner_id=self.request.user.id, recipe_id=self.kwargs['id'])
    
class CheckShoppingView(RetrieveAPIView):
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        print(self.kwargs['id'])
        return get_object_or_404(ShoppingList, owner_id=self.request.user.id, recipe_id=self.kwargs['id'])
    
class HistoryAPIView(ListAPIView): # WORKS
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return HistoryList.objects.filter(owner_id=self.request.user.id).order_by("-datetime_viewed")
        
    
class ShoppingListAPIView(ListAPIView): # WORKS
    serializer_class = ShoppingListSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return ShoppingList.objects.filter(owner_id=self.request.user.id)


class IngredientsAPIView(ListAPIView): # WORKS
    serializer_class = IngredientSerializer

    def get_queryset(self):
        if self.kwargs['name'] == "*":
            return Ingredient.objects.all()
        return Ingredient.objects.filter(name__icontains=self.kwargs['name'])
    
class DietsAPIView(ListAPIView): # WORKS
    serializer_class = DietSerializer

    def get_queryset(self):
        if self.kwargs['name'] == "*":
            return Diet.objects.all()
        return Diet.objects.filter(name__icontains=self.kwargs['name'])

class RecipeEditView(UpdateAPIView): # WORKS
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        
        if not Recipe.objects.filter(owner=self.request.user.id):
            raise PermissionDenied({"403":"You do not have permission to edit recipe"})
        
        return get_object_or_404(Recipe, owner=self.request.user.id, id=self.kwargs['id'])

# Uses DELETE in postman
class RecipeDeleteView(DestroyAPIView): # WORKS
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        
        if not Recipe.objects.filter(owner=self.request.user.id):
            raise PermissionDenied({"403":"You do not have permission to delete recipe"})
        
        return get_object_or_404(Recipe, owner=self.request.user.id, id=self.kwargs['id'])
    
class NewCommentView(CreateAPIView): # WORKS
    serializer_class = RecipeCommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(Recipe, id=self.kwargs['id'])
    
    
# IMAGE VIEWS ##########################################

class CreateRecipeImgView(CreateAPIView):
    serializer_class = RecipeImageSerializer
    permission_classes = [IsAuthenticated]
    
class CreateRecipeStepImgView(CreateAPIView):
    serializer_class = RecipeStepImageSerializer
    permission_classes = [IsAuthenticated]
    
class CreateRecipeCommentImgView(CreateAPIView):
    serializer_class = RecipeCommentImageSerializer
    permission_classes = [IsAuthenticated]
    
class AllRecipeImgView(RetrieveAPIView):
    serializer_class = RecipeImageSerializer
    def get_object(self):
        return get_object_or_404(RecipeImage, id=self.kwargs['id']) 
    
class AllRecipeStepImgView(RetrieveAPIView):
    serializer_class = RecipeStepImageSerializer
    def get_object(self):
        return get_object_or_404(RecipeStepImage, id=self.kwargs['id'])
    
class AllRecipeCommentImgView(RetrieveAPIView):
    serializer_class = RecipeCommentImageSerializer
    def get_object(self):
        return get_object_or_404(RecipeCommentImage, id=self.kwargs['id'])
    
class AllRecipeImgView(ListAPIView):
    serializer_class = RecipeImageSerializer
    def get_queryset(self):
        return RecipeImage.objects.all()
    
class AllRecipeStepImgView(ListAPIView):
    serializer_class = RecipeStepImageSerializer
    def get_queryset(self):
        return RecipeStepImage.objects.all()
    
class AllRecipeCommentImgView(ListAPIView):
    serializer_class = RecipeCommentImageSerializer
    def get_queryset(self):
        return RecipeCommentImage.objects.all()