import { User }  from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

// Define types for the arguments
interface AddUserArgs {
    input: {
        username: string;
        email: string;
        password: string;
    }
}

interface LoginUserArgs {
    email: string;
    password: string;
}

interface UserArgs {
    _id?: string;
    username: string;
}

interface BookArgs {
    bookId: string;
}

interface AddBookArgs {
    input: {
        bookId: string;
        authors: string[];
        description: string;
        title: string;
        image: string;
        link: string;
    }
}

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate('savedBooks')
        },
        user: async(_parent: any, { username }: UserArgs) => {
            return User.findOne({ username }).populate('savedBooks');
        },
        // Query to get the authenticated user's information
        // The 'me' query relies on the context to check if the user is authenticated
        me: async (_parent: any, _args: any, context: any) => {
            // If the user is authenticated, find and return the user's information along with their saved books
            if(context.user){
                return User.findOne({ _id: context.user._id }).populate('savedBooks');
            }
            // If the user is not authenticated, throw an AuthenticationError
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        addUser: async (_parent: any, { input }: AddUserArgs) => {
            // Create a new user with the provided username, email, and password
            const user = await User.create({ ...input });
            
            // Sign a token with the user's information
            const token = signToken(user.username, user.password, user._id);

            // Return the token and the user
            return { token, user };
        },

        login: async(_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });

            // If no user is found, throw an AuthenticationError
            if(!user){
                throw new AuthenticationError('Could not authenticate user.');
            }

            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);

            // If the password is incorrect, throw an AuthenticationError
            if(!correctPw){
                throw new AuthenticationError('Could not authenticate user.');
            }

            // Sign a token with the user's information
            const token = signToken(user.username, user.password, user._id);

            // Return the token and the user
            return { token, user };
        },

        saveBook: async(_parent: any, { input }: AddBookArgs, context: any) => {
            console.log("Received input:", input);
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true },
                );

                return updatedUser;
            }
            throw AuthenticationError;
            ('You need to be logged in!');
        },

        deleteBook: async(_parent: any, { bookId }: BookArgs, context: any) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true },
                ); 

                if(!updatedUser){
                    throw new AuthenticationError('Could not find user!')
                }

                return updatedUser;
            }
            throw AuthenticationError;
        }
    }

}

export default resolvers;
