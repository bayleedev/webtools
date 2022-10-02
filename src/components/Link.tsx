import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

export interface LinkProps {
  to: string
  activeClassName: string
  className: string
  children: any
}

export const Link = (props: LinkProps) => {
  const { pathname } = useLocation();

  const isActive = pathname === props.to

  const className = [
    props.className,
    isActive ? props.activeClassName : '',
  ].join(' ')

  return (
    <>
      <RouterLink
        to={props.to}
        className={className}
      >
        {props.children}
      </RouterLink>
    </>
  );
}
