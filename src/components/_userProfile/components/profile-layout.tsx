import CustomInput from "@/components/form/custom-input";
import CustomTextarea from "@/components/form/custom-textarea";
import CustomProfileSelect from "@/components/form/profile-select";
import SubmitLoader from "@/components/loaders/submit-loader";
import { Form } from "@/components/ui/form";
import {
  CreateUserZodType,
  UseCreateUserProfile,
  UseCreateUserZodForm,
  UseUpdateUserProfile,
} from "../hooks/user-profile-crud-hook";
import { fruitOptions } from "@/storage/app-svg";
import { UseGetUserProfiles } from "../hooks/use-get-existing-user-prfofile";
import { useToast } from "@/hooks/use-toast";
import SuccessToast from "@/components/toasts/success-toast";
import ErrorToast from "@/components/toasts/error-toast";
import { useCurrentUser } from "@/components/auth/hooks/get-current-user";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProfileLayout = () => {
  const { form } = UseCreateUserZodForm();
  const navigate = useNavigate();
  const { mutate: updateUser, isPending: updatingUser } =
    UseUpdateUserProfile();
  const { mutate: createUser, isPending: creatingUser } =
    UseCreateUserProfile();
  const { data: ExistingUser, isLoading: isLoadingExistingUser } =
    UseGetUserProfiles();
  const { toast } = useToast();
  const { user, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    if (ExistingUser) {
      form.reset({
        extraUserDetais: {
          firstName: ExistingUser.extraUserDetais.firstName,
          lastName: ExistingUser.extraUserDetais.lastName,
          addAdditionalName: ExistingUser.extraUserDetais.addAdditionalName,
          addAdditionalEmail: ExistingUser.extraUserDetais.addAdditionalEmail,
          address: ExistingUser.extraUserDetais.address,
          phoneNumber: ExistingUser.extraUserDetais.phoneNumber,
          customProfilePicture:
            ExistingUser.extraUserDetais.customProfilePicture,
          name: ExistingUser.extraUserDetais.name,
          email: ExistingUser.extraUserDetais.email,
        },
      });
    }
  }, [ExistingUser, form]);

  const handleMakeUser = (values: CreateUserZodType) => {
    if (ExistingUser?._id) {
      updateUser(
        {
          userDetailsId: ExistingUser._id,
          extraUserDetails: {
            ...values.extraUserDetais,
          }, // Send only extraUserDetails
        },
        {
          onSuccess: () => {
            toast({
              description: (
                <SuccessToast message="User details updated successfully." />
              ),
            });
          },
          onError: (error) => {
            console.error("Error updating user details:", error);

            toast({
              description: (
                <ErrorToast
                  message={error.message || "Failed to update user"}
                />
              ),
            });
          },
          onSettled: () => {
            // Any actions to perform after success or error
          },
        }
      );
    } else {
      if (user?._id) {
        createUser(
          {
            existingUserId: user._id,
            extraUserDetais: {
              firstName: values.extraUserDetais.firstName,
              lastName: values.extraUserDetais.lastName,
              addAdditionalName: values.extraUserDetais.addAdditionalName,
              addAdditionalEmail: values.extraUserDetais.addAdditionalEmail,
              address: values.extraUserDetais.address,
              phoneNumber: values.extraUserDetais.phoneNumber,
              customProfilePicture: values.extraUserDetais.customProfilePicture,
              name: values.extraUserDetais.name, // Add name field
              email: values.extraUserDetais.email, // Add email field
            },
          },
          {
            onSuccess: () => {
              toast({
                variant: "default",
                title: "Profile Created",
                description: "Your user profile has been created.",
              });
              form.reset();
            },
            onError: (error) => {
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            },
          }
        );
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found. Please try again.",
        });
      }
    }
  };

  const isLoading = updatingUser || creatingUser;

  if (isLoadingUser || isLoadingExistingUser) {
    return (
      <div className=" min-h-screen w-full  p-10 shadow rounded-lg ">
        <div className="space-y-6 max-w-5xl w-full flex flex-col mx-auto">
          <div className=" flex flex-row w-full">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="default"
              type="button"
              className="flex justify-center items-center group-[button]:"
            >
              <ArrowLeftIcon className="group-[button]:ml-0.5 transition-all duration-300 ease-in-out" />
              <span>Back</span>
            </Button>
            <div className="w-full flex flex-col gap-y-4 justify-center  items-center">
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="w-20 h-8" />
            </div>
          </div>

          <div className="flex flex-row gap-x-2">
            <Skeleton className="h-12 rounded-xl w-full" />
            <Skeleton className="h-12 rounded-xl  w-full" />
          </div>

          <div className="flex flex-row gap-x-2">
            <Skeleton className="h-12 rounded-xl w-full" />
            <Skeleton className="h-12 rounded-xl w-full" />
            <Skeleton className="h-12 rounded-xl w-full" />
          </div>
          <Skeleton className="h-28 w-full" />

          <div>
            <Skeleton className="w-full flex justify-center py-2 px-4 h-10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-10 shadow rounded-lg ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleMakeUser)}
          className="space-y-6 max-w-5xl mx-auto"
        >
          <div className="">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="default"
              type="button"
              className="flex justify-center items-center group-[button]:"
            >
              <ArrowLeftIcon className="group-[button]:ml-0.5 transition-all duration-300 ease-in-out" />
              <span>Back</span>
            </Button>
            <CustomProfileSelect
              control={form.control}
              name="extraUserDetais.customProfilePicture"
              label="Select a Fruit"
              placeholder="Choose a fruit"
              options={fruitOptions}
              disabled={isLoading}
            />

            <Button variant="outline" size="default" type="button">
              <Link to="/admin">Admin</Link>
            </Button>
          </div>
          <div className="flex flex-row gap-x-2">
            <CustomInput
              control={form.control}
              label="First Name"
              name="extraUserDetais.firstName"
              disabled={isLoading}
              placeholder="Enter your first name"
            />
            <CustomInput
              control={form.control}
              label="Last Name"
              name="extraUserDetais.lastName"
              disabled={isLoading}
              placeholder="Enter your last name"
            />
          </div>

          <div className="flex flex-row gap-x-2">
            <CustomInput
              control={form.control}
              label="Additional Email"
              name="extraUserDetais.addAdditionalEmail"
              disabled={isLoading}
              placeholder="Enter an additional email"
            />
            <CustomInput
              control={form.control}
              label="Additional Name"
              name="extraUserDetais.addAdditionalName"
              disabled={isLoading}
              placeholder="Enter an additional name"
            />
            <CustomInput
              control={form.control}
              label="Phone Number"
              name="extraUserDetais.phoneNumber"
              disabled={isLoading}
              placeholder="Enter your phone number"
            />
          </div>
          <CustomTextarea
            control={form.control}
            label="Address"
            name="extraUserDetais.address"
            disabled={isLoading}
            placeholder="Enter your address"
          />

          <div>
            <SubmitLoader
              defaultText="Update Details"
              loadingIcon={LoaderIcon}
              loadingState={isLoading}
              loadingText="Updating.."
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileLayout;
