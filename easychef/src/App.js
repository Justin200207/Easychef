import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import UserContext, {useUserContext} from "./contexts/UserContext";

import EasyChefNav from "./components/Navbar/Navbar";
import HomePage from './pages/Home/Home';
import Search from './pages/Search/Search';
import MyRecipes from './pages/MyRecipes/MyRecipes';
import NewRecipes from './pages/NewRecipes/NewRecipes';
import ShoppingList from './pages/ShoppingList/ShoppingList';
import Signup from './pages/Signup/Signup';
import EditProfile from './pages/EditProfile/EditProfile';
import Login from './pages/Login/Login';
import Logout from './pages/Logout/Logout';
import RecipePage from './pages/RecipePage/RecipePage'
import RecipeEdit from './pages/EditRecipe/EditRecipe';
import RecipeContext, { useRecipeContext } from './contexts/RecipeContext';

function App() {

  const signup = (
    <UserContext.Provider value={useUserContext()}>
      <Signup />
    </UserContext.Provider>
  )

  const edit_profile = (
    <UserContext.Provider value={useUserContext()}>
      <EditProfile />
    </UserContext.Provider>
  )

  const new_recipe = (
    <RecipeContext.Provider value={useRecipeContext()}>
      <NewRecipes />
    </RecipeContext.Provider>
  )

  const search = (
    <RecipeContext.Provider value={useRecipeContext()}>
      <Search />
    </RecipeContext.Provider>
  )

  const recipePage = (
    <RecipeContext.Provider value={useRecipeContext()}>
      <RecipePage/>
    </RecipeContext.Provider>
  )

  return (
    <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EasyChefNav/>}>
              <Route index element={<HomePage/>} />
              <Route path="my_recipes" element={<MyRecipes/>} />
              <Route path="new_recipes" element={new_recipe} />
              <Route path="shopping_list" element={<ShoppingList/>} />
              <Route path="signup" element={signup} />
              <Route path="edit_profile" element={edit_profile} />
              <Route path="login" element={<Login/>} />
              <Route path="logout" element={<Logout/>} />
              <Route path="search" element={search}/>
              <Route path="recipes" element={recipePage}/>
              <Route path="recipes/edit/" element={<RecipeEdit/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
