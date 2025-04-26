import {
  INotification,
  INotificationComment,
  INotificationReact,
  INotificationSquad
} from '../hooks/interface'

const renderNotiContent = (notification: INotification) => {
  if (notification.type === 'COMMENT') {
    const entity = notification.entity as INotificationComment

    return {
      title: `${entity.sender.profileName} has left a comment on your post`,
      subtitle: entity.commentRequest.content.text,
      href: `/post/${entity.postId}`
    }
  }

  if (notification.type === 'LIKE') {
    const entity = notification.entity as INotificationReact

    return {
      title: `${entity.sender.profileName} has liked your post`,
      subtitle: '',
      href: `/post/${entity.postId}`
    }
  }

  if (notification.type === 'DISLIKE') {
    const entity = notification.entity as INotificationReact

    return {
      title: `${entity.sender.profileName} has disliked your post`,
      subtitle: '',
      href: `/post/${entity.postId}`
    }
  }

  if (notification.type === 'REQUEST_JOIN') {
    const entity = notification.entity as INotificationSquad

    return {
      title: `${entity.sender.profileName} has requested to join your squad`,
      subtitle: '',
      href: `/squad/${entity.tagName}?tab=manage-squad`
    }
  }

  if (notification.type === 'ACCEPT') {
    const entity = notification.entity as INotificationSquad

    return {
      title: `${entity.sender.profileName} has accepted your request to join their squad`,
      subtitle: '',
      href: `/squad/${entity.tagName}`
    }
  }

  return { title: '', href: '.' }
}

export default renderNotiContent
