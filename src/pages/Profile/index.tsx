import React, { useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';

import * as Yup from 'yup';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/Auth';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container,
  Title,
  UserAvatar,
  UserAvatarButton,
  BackButton,
} from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  oldPassword: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const { user, updateUser } = useAuth();

  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);

  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    console.log(user);
  }, []);

  const handleSignUp = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const shema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatorio'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatorio'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });

        await shema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password_confirmation,
          password,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_passoword: old_password,
                passoword: password,
                passoword_confirmation: password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);
        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente',
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(
          {
            mediaType: 'photo',
          },
          response => {
            if (response.didCancel) {
              return;
            }

            if (response.errorMessage) {
              Alert.alert('Erro ao atualizar seu avatar.');
              return;
            }

            // {"assets": [{"fileName": "rn_image_picker_lib_temp_30ac59c9-53cb-4480-a1b4-e703a644a0c0.jpg", "fileSize": 1570498, "height": 3096, "type": "image/jpeg", "uri": "file:///data/user/0/com.appgobarber/cache/rn_image_picker_lib_temp_30ac59c9-53cb-4480-a1b4-e703a644a0c0.jpg", "width": 4128}]}
            const data = new FormData();

            data.append('avatar', {
              type: 'image/jpeg',
              name: `${user.id}.jpg`,
              uri: response.assets[0].uri,
            });
            console.log(data);
            api
              .patch('users/avatar', data)
              .then(apiResponse => {
                console.log(apiResponse);
                updateUser(apiResponse.data);
              })
              .catch(err => {
                console.log(err, 'erro');
              });
          },
        );
      } else {
        Alert.alert('Permissão a camera negada');
      }
    } catch (err) {
      console.warn(err.message);
    }
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>

            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>

            <Form
              ref={formRef}
              initialData={user}
              style={{ width: '100%' }}
              onSubmit={handleSignUp}
            >
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-Mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                name="old_password"
                containerStyle={{ marginTop: 16 }}
                icon="lock"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                placeholder="Senha atual"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                placeholder="Nova senha"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus();
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="password_confirmation"
                icon="lock"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                placeholder="Confirmar senha"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignUp;
