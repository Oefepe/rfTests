type ArrowIconProps = {
  rotation?: string;
  width?: string;
  height?: string;
  color?: string;
};

export const ArrowIcon = ({ rotation = '0', width = '26', height = '26', color = '#5B5A5A' }: ArrowIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 26 26"
    fill="none"
    transform={`rotate(${rotation})`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g id="Left Angle">
      <path
        id="Vector"
        d="M6.58581 11.588C5.80473 12.369 5.80473 13.6373 6.58581 14.4182L16.5836 24.4143C17.3647 25.1952 18.6331 25.1952 19.4142 24.4143C20.1953 23.6333 20.1953 22.3651 19.4142 21.5841L10.8286 13L19.4079 4.41585C20.189 3.63491 20.189 2.36665 19.4079 1.58571C18.6269 0.804764 17.3584 0.804764 16.5773 1.58571L6.57956 11.5818L6.58581 11.588Z"
        fill={color}
      />
    </g>
  </svg>
);
