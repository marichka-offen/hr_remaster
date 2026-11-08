// Turns a block's _editable value into the attributes Storyblok's Visual Editor looks for, which enable
// outlines and click-to-edit in the preview. _editable is only present in draft content, so published
// pages never get these attributes.
//
// Storyblok sends _editable as an HTML comment wrapping JSON: <!--#storyblok#{"name":…,"space":…,"uid":…,"id":…}-->

export function editableAttrs(editable?: string): Record<string, string> {
    const json = editable?.match(/<!--#storyblok#(.*?)-->/)?.[1]
    if (!json) return {}
    try {
        const { id, uid } = JSON.parse(json) as { id: string | number; uid: string }
        return { 'data-blok-c': json, 'data-blok-uid': `${id}-${uid}` }
    } catch {
        return {}
    }
}
