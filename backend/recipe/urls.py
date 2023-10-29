from django.urls import path

from recipe.views import *

urlpatterns = [
    path('new/', NewRecipeView.as_view()),
    path('<int:id>/', RecipeView.as_view()),
    path('search/', SearchAPIView.as_view()),
    path('<int:id>/edit/', RecipeEditView.as_view()),
    path('<int:id>/delete/', RecipeDeleteView.as_view()),
    path('<int:id>/new_comment/', NewCommentView.as_view()),
    path('<int:id>/rating/', RatingAPIView.as_view()),
    path('ingredients/<str:name>/', IngredientsAPIView.as_view()),
    path('diets/<str:name>/', DietsAPIView.as_view()),
    path('favourite/', FavouriteAddAPIView.as_view()),
    path('removefavourite/<int:id>', RemoveFavAPIView.as_view()),
    path('shoppinglistadd/', ShoppingListAddAPIView.as_view()),
    path('shoppinglistremove/<int:id>', RemoveShopAPIView.as_view()),
    path('rate/', RatingListAddAPIView.as_view()),
    path('mycreations/', MyCreationAPIView.as_view()),
    path('myfavourites/', FavouritedAPIView.as_view()),
    path('checkfavourite/<int:id>/', CheckFavouriteView.as_view()),
    path('checkshopping/<int:id>/', CheckShoppingView.as_view()),
    path('history/', HistoryAPIView.as_view()),
    path('shoppinglist/', ShoppingListAPIView.as_view()),
    
    path('CreateRecipeImage/', CreateRecipeImgView.as_view()),
    path('CreateRecipeStepImage/', CreateRecipeStepImgView.as_view()),
    path('CreateRecipeCommentImage/', CreateRecipeCommentImgView.as_view()),
    path('RecipeImage/<int:id>/', AllRecipeImgView.as_view()),
    path('RecipeStepImage/<int:id>/', AllRecipeStepImgView.as_view()),
    path('RecipeCommentImage/<int:id>/', AllRecipeCommentImgView.as_view()),
    path('AllRecipeImgs/', AllRecipeImgView.as_view()),
    path('AllRecipeStepImgs/', AllRecipeStepImgView.as_view()),
    path('AllRecipeCommentImgs/', AllRecipeCommentImgView.as_view()),
]