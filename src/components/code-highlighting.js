import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import { Pre, LineNo } from './code-style'


const preToCodeBlock = preProps => {
  if (
    // children is MDXTag
    preProps.children &&
    // MDXTag props
    preProps.children.props &&
    // if MDXTag is going to render a <code>
    preProps.children.props.name === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      props: { className, ...props },
    } = preProps.children.props

    return {
      codeString: codeString.trim(),
      language: className && className.split('-')[1],
      ...props,
    }
  }
  if (preProps.children && typeof preProps.children === 'string') {
    const { children, className, ...props } = preProps
    return {
      codeString: children.trim(),
      language: className && className.split('-')[1],
      ...props,
    }
  }
  return undefined
}



const InlineCode = ({ codeString, language /* , ...props */ }) => {
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={style}>
          {tokens.map((line, i) => (
            <span {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </span>
          ))}
        </code>
      )}
    </Highlight>
  )
}

const Code = ({ codeString, language /* , ...props */ }) => {
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language={language}
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Pre>
      )}
    </Highlight>
  )
}

export const PrismjsReplacement = preProps => {
  const props = preToCodeBlock(preProps)
  // if there's a codeString and some props, we passed the test
  if (props) {
    return <Code {...props} />
  }
  // it's possible to have a pre without a code in it
  return <pre {...preProps} />
}

export const PrismjsReplacementInline = preProps => {
  const props = preToCodeBlock(preProps)
  // if there's a codeString and some props, we passed the test
  if (props) {
    return <InlineCode {...props} />
  }
  // it's possible to have a pre without a code in it
  return <code {...preProps} />
}
