export type AuthUser = {
    authUserId: string;
    email?: string;
};
export declare const CurrentUser: (...dataOrPipes: any[]) => ParameterDecorator;
