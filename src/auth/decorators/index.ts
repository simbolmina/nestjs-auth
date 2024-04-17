import { UseGuards, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { commonErrorResponses } from 'src/common/constants';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { AuthenticatedResponseDto } from '../dtos/auth-response.dto';
import { LocalAuthGuard } from 'src/guards/local.guard';
import { LoginUserDto } from '../dtos/login-user.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { LoginWithTwoFactorAuthenticationDto } from '../dtos/login-with-2fa.dto';
import { Resend2faOtpDto } from '../dtos/resend-2fa-otp.dto';
import { ValidateOtpDto } from '../dtos/validate-otp.dto';
import { TwoFactorAuthGuard } from 'src/guards/2FA.guard';

export function RegisterUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User registration',
      description:
        'This endpoint allows new users to create an account. Users provide an email and password which are then stored in the database. If the operation is successful, a new JWT token is created for the user and returned in a cookie.',
    }),
    ApiCreatedResponse({
      description: 'The user has been successfully created.',
      type: AuthenticatedResponseDto,
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiForbiddenResponse(commonErrorResponses.forbidden),
    ApiUnprocessableEntityResponse(
      commonErrorResponses.unprocessableEntityResponse,
    ),
  );
}

export function LoginUsersDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description:
        "This endpoint allows existing users to authenticate with the system. Users provide their email and password, and if they match what's in the database, a new JWT token is created for the user and returned in a cookie. If the email does not exist in the database, or if the password does not match, an error message is returned.",
    }),
    ApiOkResponse({
      description: 'Returns the user and access token',
      type: AuthenticatedResponseDto,
    }),
    ApiBody({ type: LoginUserDto }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    UseGuards(LocalAuthGuard),
  );
}

export function GoogleLoginDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Google login',
      description:
        "This endpoint allows users to authenticate or register using their Google account. The user provides their Google credential and if it's valid, a new JWT token is created for the user and returned in a cookie. If the user does not exist in the database, a new user is created.",
    }),
    ApiCreatedResponse({
      description: 'The user has been successfully logged in or created.',
      type: AuthenticatedResponseDto,
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.invalidKey),
  );
}

export function ChangePasswordDecorator() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Change current user password',
      description:
        'This endpoint allows the currently authenticated user to change their password. The user must provide their current password for verification along with the new password. The user must be authenticated with a valid JWT token.',
    }),
    ApiOkResponse({
      description: 'Password has been changed',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBody({
      description: 'Password change data',
      type: ChangePasswordDto,
    }),
    UseGuards(JwtAuthGuard),
  );
}

export function ForgotPasswordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Request a password reset link' }),
    ApiBody({ type: ForgotPasswordDto, description: 'Email' }),
    ApiOkResponse(),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiNotFoundResponse(commonErrorResponses.notFound),
  );
}

export function ResetPasswordDecorator() {
  return applyDecorators(
    ApiOperation({ summary: 'Reset the password using reset token' }),
    ApiBody({
      type: ResetPasswordDto,
      description: 'Reset Token and New Password',
    }),
    ApiCreatedResponse({
      description: 'Returns tokens ',
      type: AuthenticatedResponseDto,
    }),
    ApiNotFoundResponse(commonErrorResponses.invalidKey),
  );
}

export function RefreshTokenDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Send refresh token to receive new token and refreshToken',
    }),
    ApiCreatedResponse({
      description: 'Returns tokens',
      type: AuthenticatedResponseDto,
    }),
    ApiUnauthorizedResponse(commonErrorResponses.invalidKey),
    ApiBody({ type: RefreshTokenDto }),
  );
}

export function LoginWithTwoFactorDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Login with Two-Factor Authentication',
      description:
        'This endpoint allows users with 2FA enabled to login by providing their email and the OTP sent to their email. If the OTP matches and is valid, the user will be authenticated.',
    }),
    ApiOkResponse({
      description: 'User is logged in successfully, returns access token',
      type: AuthenticatedResponseDto,
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiNotFoundResponse(commonErrorResponses.notFound),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBody({ type: LoginWithTwoFactorAuthenticationDto }),
    UseGuards(TwoFactorAuthGuard),
  );
}

export function ResendTwoFactorAuthForLoginDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend OTP for Two-Factor Authentication during Login',
      description:
        'This endpoint is used when a user needs the OTP resent to their email during the login process. The user must provide a valid temporary authentication token.',
    }),
    ApiOkResponse({
      description: 'OTP has been resent successfully',
      type: Resend2faOtpDto,
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBody({ type: Resend2faOtpDto }),
  );
}

export function SetupTwoFactorAuthDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Setup Two-Factor Authentication',
      description:
        'This endpoint initiates the setup of Two-Factor Authentication by sending an OTP to the user’s email. The user must verify the OTP to complete the setup.',
    }),
    ApiOkResponse({
      description: '2FA setup initiated, OTP sent to email',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    UseGuards(JwtAuthGuard),
  );
}

export function VerifyTwoFactorAuthDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify OTP for Two-Factor Authentication Setup',
      description:
        'This endpoint verifies the OTP provided by the user during the setup of Two-Factor Authentication. If the OTP is valid, 2FA is enabled for the user.',
    }),
    ApiOkResponse({
      description: '2FA has been set up successfully',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    ApiBody({ type: ValidateOtpDto }),
    UseGuards(JwtAuthGuard),
  );
}

export function ResendTwoFactorAuthDecorator() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend OTP for Two-Factor Authentication',
      description:
        'This endpoint resends the OTP to the user’s email for Two-Factor Authentication. It can be used if the user did not receive the OTP initially or if the OTP has expired.',
    }),
    ApiOkResponse({
      description: 'OTP has been resent successfully',
    }),
    ApiBadRequestResponse(commonErrorResponses.badRequest),
    ApiUnauthorizedResponse(commonErrorResponses.unAuthorized),
    UseGuards(JwtAuthGuard),
  );
}
