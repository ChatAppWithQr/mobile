import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { blurhash } from '../utils/common';
import Loading from './Loading';

export default function Profile({ visible, onClose }) {
    const { user, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    
    const usernameRef = useRef(user?.username || "");
    const profileUrlRef = useRef(user?.profileUrl || "");
    const passwordRef = useRef("");
    const confirmPasswordRef = useRef("");

    const handleSave = async () => {
        if (!usernameRef.current.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }

        if (passwordRef.current && passwordRef.current !== confirmPasswordRef.current) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (passwordRef.current && passwordRef.current.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        
        const updateData = {
            username: usernameRef.current.trim(),
            profileUrl: profileUrlRef.current.trim()
        };

        if (passwordRef.current) {
            updateData.password = passwordRef.current;
        }

        try {
            const result = await updateProfile(updateData);
            if (result.success) {
                Alert.alert('Success', 'Profile updated successfully');
                setEditMode(false);
                passwordRef.current = "";
                confirmPasswordRef.current = "";
            } else {
                Alert.alert('Error', result.msg || 'Failed to update profile');
            }
        } catch (_error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original values
        usernameRef.current = user?.username || "";
        profileUrlRef.current = user?.profileUrl || "";
        passwordRef.current = "";
        confirmPasswordRef.current = "";
        setEditMode(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-telegram-lighter">
                {/* Header */}
                <View 
                    style={{ 
                        paddingTop: hp(6.5),
                        paddingBottom: hp(1.5),
                        backgroundColor: '#0088CC'
                    }}
                    className="px-4"
                >
                    <View className="flex-row justify-between items-center">
                        <TouchableOpacity onPress={onClose} className="p-1">
                            <Ionicons name="close" size={hp(3)} color="white" />
                        </TouchableOpacity>
                        
                        <Text className="text-white font-medium text-lg">Profile</Text>
                        
                        {editMode ? (
                            <View className="flex-row gap-3">
                                <TouchableOpacity onPress={handleCancel} className="p-1">
                                    <Text className="text-white font-medium">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave} className="p-1">
                                    <Text className="text-white font-medium">Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setEditMode(true)} className="p-1">
                                <Feather name="edit-3" size={hp(2.5)} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 py-6">
                    {/* Profile Picture */}
                    <View className="items-center mb-8">
                        <View 
                            style={{
                                width: hp(15),
                                height: hp(15),
                                borderRadius: hp(7.5),
                                backgroundColor: 'rgba(0, 136, 204, 0.1)',
                                overflow: 'hidden',
                                marginBottom: hp(2)
                            }}
                        >
                            <Image
                                source={{ 
                                    uri: (editMode ? profileUrlRef.current : user?.profileUrl) || 
                                         "https://picsum.photos/seed/696/300/300" 
                                }}
                                placeholder={{ blurhash }}
                                contentFit="cover"
                                transition={500}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </View>
                        
                        {editMode && (
                            <TouchableOpacity 
                                className="bg-telegram-primary px-4 py-2 rounded-full"
                                onPress={() => Alert.alert('Feature Coming Soon', 'Image picker functionality will be added')}
                            >
                                <Text className="text-white font-medium">Change Photo</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Profile Fields */}
                    <View className="gap-6">
                        {/* Username */}
                        <View>
                            <Text className="text-telegram-textLight mb-2 font-medium">Username</Text>
                            {editMode ? (
                                <TextInput
                                    defaultValue={user?.username}
                                    onChangeText={value => usernameRef.current = value}
                                    style={{ 
                                        height: hp(6),
                                        fontSize: hp(1.9),
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        backgroundColor: '#F8F9FA',
                                        borderWidth: 1,
                                        borderColor: '#E9ECEF'
                                    }}
                                    className="text-telegram-text"
                                    placeholder="Enter username"
                                />
                            ) : (
                                <View 
                                    style={{ 
                                        height: hp(6),
                                        justifyContent: 'center',
                                        paddingHorizontal: 16,
                                        backgroundColor: '#F8F9FA',
                                        borderRadius: 12
                                    }}
                                >
                                    <Text style={{ fontSize: hp(1.9) }} className="text-telegram-text">
                                        {user?.username || 'Not set'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="text-telegram-textLight mb-2 font-medium">Email</Text>
                            <View 
                                style={{ 
                                    height: hp(6),
                                    justifyContent: 'center',
                                    paddingHorizontal: 16,
                                    backgroundColor: '#F8F9FA',
                                    borderRadius: 12
                                }}
                            >
                                <Text style={{ fontSize: hp(1.9) }} className="text-telegram-textLight">
                                    {user?.email || 'Not available'}
                                </Text>
                            </View>
                        </View>

                        {/* Profile URL */}
                        {editMode && (
                            <View>
                                <Text className="text-telegram-textLight mb-2 font-medium">Profile Picture URL</Text>
                                <TextInput
                                    defaultValue={user?.profileUrl}
                                    onChangeText={value => profileUrlRef.current = value}
                                    style={{ 
                                        height: hp(6),
                                        fontSize: hp(1.9),
                                        borderRadius: 12,
                                        paddingHorizontal: 16,
                                        backgroundColor: '#F8F9FA',
                                        borderWidth: 1,
                                        borderColor: '#E9ECEF'
                                    }}
                                    className="text-telegram-text"
                                    placeholder="Enter image URL"
                                    multiline={false}
                                />
                            </View>
                        )}

                        {/* Password Change */}
                        {editMode && (
                            <>
                                <View>
                                    <Text className="text-telegram-textLight mb-2 font-medium">New Password (Optional)</Text>
                                    <TextInput
                                        onChangeText={value => passwordRef.current = value}
                                        style={{ 
                                            height: hp(6),
                                            fontSize: hp(1.9),
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: '#F8F9FA',
                                            borderWidth: 1,
                                            borderColor: '#E9ECEF'
                                        }}
                                        className="text-telegram-text"
                                        placeholder="Enter new password"
                                        secureTextEntry
                                    />
                                </View>

                                <View>
                                    <Text className="text-telegram-textLight mb-2 font-medium">Confirm New Password</Text>
                                    <TextInput
                                        onChangeText={value => confirmPasswordRef.current = value}
                                        style={{ 
                                            height: hp(6),
                                            fontSize: hp(1.9),
                                            borderRadius: 12,
                                            paddingHorizontal: 16,
                                            backgroundColor: '#F8F9FA',
                                            borderWidth: 1,
                                            borderColor: '#E9ECEF'
                                        }}
                                        className="text-telegram-text"
                                        placeholder="Confirm new password"
                                        secureTextEntry
                                    />
                                </View>
                            </>
                        )}
                    </View>

                    {/* User Info */}
                    {!editMode && (
                        <View className="mt-8 pt-6 border-t border-telegram-separator">
                            <Text className="text-telegram-textLight mb-4 font-medium">Account Information</Text>
                            <View className="gap-3">
                                <Text className="text-telegram-textLight text-sm">
                                    User ID: {user?.userId || user?.uid || 'Unknown'}
                                </Text>
                                <Text className="text-telegram-textLight text-sm">
                                    Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Loading Overlay */}
                {loading && (
                    <View 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 999
                        }}
                    >
                        <Loading size={hp(8)} />
                    </View>
                )}
            </View>
        </Modal>
    );
}
