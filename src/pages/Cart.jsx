import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartItemsMutation } from "../services/api/cartApi";
import { useNavigate } from "react-router-dom";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Link as RouterLink } from "react-router-dom";
import { useIsLoginQuery } from "../services/api/authApi";
import {
  useGetCustomerPurchasedQuery,
  usePurchasedMutation,
} from "../services/api/purchasedApi";

import {
  Typography,
  Grid,
  Stack,
  Container,
  Button,
  Divider,
  Link,
} from "@mui/material";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";

import {
  CustomCartItem,
  PurchasedHistory,
  CustomAlert,
} from "../components/index";
import { isAtCart } from "../features/auth/authSlice";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

function CartPage() {
  return (
    <Elements stripe={stripePromise}>
      <CartContent />
    </Elements>
  );
}

export default CartPage;

const CartContent = () => {
  const [purchased] = usePurchasedMutation();
  const [getCartItems, { isLoading }] = useGetCartItemsMutation();
  const { data, isLoading: isLoadingPurchased } =
    useGetCustomerPurchasedQuery();
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    label: "",
    open: false,
    severity: "error",
  });
  const { data: loggedIn } = useIsLoginQuery();

  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { isAuthenticated, isVerified } = useSelector((state) => state.auth);
  const totalItemQuantity = cart.totalQuantity;
  const [t] = useTranslation('global');

  const handleCheckout = async () => {
    setLoading(true);
    dispatch(isAtCart(true));
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    if (isAuthenticated && !isVerified) {
      navigate("/auth/signup/verification");
      return;
    }

    try {
      const cartItemsResult = await handleGetCartItems();
      if (!cartItemsResult || !cartItemsResult.items) {
        throw new Error("Failed to retrieve cart items");
      }

      const data = await purchased({
        cartItems: cartItemsResult.items,
      }).unwrap();

      if (data.id) {
        const result = await stripe.redirectToCheckout({ sessionId: data.id });
        if (result.error) {
          console.error("Stripe checkout error", result.error);
        }
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (err) {
      console.error("Error during checkout", err);
    } finally {
      setLoading(false);
    }
  };
  
  



  const handleGetCartItems = async () => {
    try {
      const res = await getCartItems(cart.items).unwrap();
      if (res.status === "success") {
        return res;
      }
    } catch (err) {
      setSnackbar({
        label: err.data.message,
        open: true,
        severity: "error",
      });
      throw new Error(
        "Failed to get cart items: " + (err.message || "Unknown error")
      );
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        maxWidth: "1420px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: { xs: "50px", md: "120px" },
        pt: 10,
      }}
    >
      <CustomAlert
        label={snackbar.label}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
      />
      <Grid container>
        <Grid
          item
          md={totalItemQuantity < 1 ? 12 : 8}
          pr={totalItemQuantity < 1 ? 0 : 2}
          pb={5}
          xs={12}
        >
          <Typography variant="h4">{t('cart.yourShoppingCart')}</Typography>
          <Typography color="dark.400">
            {totalItemQuantity > 0
              ?  t("cart.foundItem", { count: totalItemQuantity })
              : t("cart.thereAreNoItemsInYourCart")}
          </Typography>
          {cart.items.map((item) => (
            <CustomCartItem
              key={item.productId}
              productId={item.productId}
              quantity={item.quantity}
              availableStock={item.availableStock}
              name={item.name}
              imageUrl={item.imageUrl}
              price={item.price}
            />
          ))}
          {totalItemQuantity < 1 && (
            <Stack
              bgcolor="grey.100"
              py={10}
              mt={2}
              alignItems="center"
              textAlign="center"
              gap={1}
            >
              <ShoppingCartOutlinedIcon
                sx={{ width: 100, height: 100, color: "dark.200" }}
              />
              <Typography sx={{maxWidth:300}} variant="bsr" color="dark.200">
                {t("cartEmpty.cartEmptyMessage")}
              </Typography>
              <Link to="/marketplace" component={RouterLink}>
                <Button
                  endIcon={<ArrowCircleRightOutlinedIcon />}
                  color="secondary"
                  disableElevation
                  variant="contained"
                >
                 {t("cartEmpty.goShopping")}
                </Button>
              </Link>
            </Stack>
          )}
        </Grid>
        {totalItemQuantity > 0 && (
          <Grid item md={4} xs>
            <Stack
              bgcolor="common.white"
              p={3}
              borderRadius={3}
              height={180}
              justifyContent="space-between"
              sx={{
                borderColor: "grey.300",
                borderStyle: "solid",
                borderWidth: "1px",
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="blgsm">{t('cart.subtotal')}</Typography>
                <Typography variant="blgsm">
                  ${(cart.totalAmount || 0).toFixed(2)}
                </Typography>
              </Stack>
              <Divider />
              <Button
                size="large"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={!stripe || loading}
                onClick={handleCheckout}
              >
                {isLoading && loading ? `${t('cart.processing')}...` : t('cart.checkout')}
              </Button>
            </Stack>
          </Grid>
        )}

        <Grid item sx={{ py: 5 }} xs={12}>
          <Divider />
        </Grid>
        {loggedIn && loggedIn?.IsAuthenticated && (
          <Grid item xs={12}>
            <PurchasedHistory
              data={data?.products || []}
              isLoading={isLoadingPurchased}
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
};
