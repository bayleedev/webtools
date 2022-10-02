import React from 'react';
import { useRoute, Link as WouterLink } from 'wouter';

export interface LinkProps {
  href: string
  className: string
  activeClass: string
  inactiveClass: string
  children: any
  onClick?: (e: any) => void
}

export const Link = (props: LinkProps) => {
  const [isActive] = useRoute(props.href);

  const handleOnClick = (e: any) => {
    if (props.onClick) {
      return props.onClick(e)
    }
  }

  const className = [
    props.className,
    isActive ? props.activeClass : props.inactiveClass
  ].join(' ')

  return (
    <WouterLink
      href={props.href}
      className={className}
      onClick={handleOnClick}
    >
      {props.children}
    </WouterLink>
  );
}
