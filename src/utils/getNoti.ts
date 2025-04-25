import { INotification, INotificationComment } from '../hooks/interface'

const renderNotiContent = (notification: INotification) => {
  if (notification.type === 'COMMENT') {
    const comment = notification.entity as INotificationComment

    return {
      title: `${notification.entity.sender.profileName} has left a comment on your post`,
      subtitle: comment.commentRequest.content.text,
      href: `/post/${notification.entity.postId}`
    }
  }

  if (notification.type === 'LIKE') {
    return {
      title: `${notification.entity.sender.profileName} has liked your post`,
      subtitle: '',
      href: `/post/${notification.entity.postId}`
    }
  }

  if (notification.type === 'DISLIKE') {
    return {
      title: `${notification.entity.sender.profileName} has disliked your post`,
      subtitle: '',
      href: `/post/${notification.entity.postId}`
    }
  }

  if (notification.type === 'REQUEST_JOIN') {
    return {
      title: `${notification.entity.sender.profileName} has requested to join your squad`,
      subtitle: ''
    }
  }

  if (notification.type === 'ACCEPT') {
    return {
      title: `${notification.entity.sender.profileName} has accepted your request to join their squad`,
      subtitle: ''
    }
  }

  return { title: '', href: '.' }
}

export default renderNotiContent
