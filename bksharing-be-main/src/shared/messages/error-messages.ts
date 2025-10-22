export enum AccountErrorMessages {
  MSG01 = 'Account not found',
  MSG02 = 'Email existed',
  MSG03 = 'Phone number existed',
  MSG04 = 'Current password is incorrect',
}

export enum MentorErrorMessages {
  MSG01 = 'Please end the current interview before update result of mentor',
  MSG02 = 'This account is not belong to this mentor',
  MSG03 = 'Profile achievement not found',
  MSG04 = 'Mentor not found',
}
export enum CategoryErrorMessages {
  MSG01 = "Category level can't exceed 2",
  MSG02 = "Category root level can't be recommended",
  MSG03 = 'Duplicate category ordinal',
  MSG04 = 'Cannot delete parent category with children',
  MSG05 = 'Some categories not found',
}

export enum AudioCallErrorMessages {
  MSG01 = 'Call is invalid',
  MSG02 = 'Account don not have permission to start call',
  MSG03 = 'Account don not have permission to end call',
  MSG04 = 'Call was finished or cancelled',
  MSG05 = 'Account is in the other call',
  MSG06 = 'Account not included in the call or joined call',
  MSG07 = 'Subscription is still active',
  MSG08 = 'Account has been already in the call',
}

export enum CourseErrorMessages {
  MSG01 = 'Course not found',
  MSG02 = 'Invalid course status to update',
}

export enum SubscriptionErrorMessages {}
