// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { $m } from 'typings/Module';

export default (LSSM: Vue, $m: $m): void => {
    const $sm = (key: string, args?: Parameters<$m>[1]) =>
        $m(`forumPost.${key}`, args);
    const btns = Array.from(
        document.querySelectorAll(
            'a[href^="/alliance_posts/"][data-method="delete"]'
        )
    );
    btns.forEach(btn => {
        btn.addEventListener('click', async e => {
            e.preventDefault();
            btn.removeAttribute('data-confirm');
            btn.removeAttribute('data-method');
            Array.from(btn.parentElement?.children || []).forEach(childBtn => {
                childBtn.classList.add('disabled');
            });
            LSSM.$modal.show('dialog', {
                title: $sm('deleteModal.title'),
                text: $sm('deleteModal.text'),
                buttons: [
                    {
                        title: $sm('deleteModal.btnCancel'),
                        default: true,
                        handler() {
                            Array.from(
                                btn.parentElement?.children || []
                            ).forEach(childBtn => {
                                childBtn.classList.remove('disabled');
                            });
                            LSSM.$modal.hide('dialog');
                        },
                    },
                    {
                        title: $sm('deleteModal.btnConfirm'),
                        async handler() {
                            await LSSM.$store
                                .dispatch('api/request', {
                                    url: btn.getAttribute('href'),
                                    init: {
                                        method: 'POST',
                                        body: new URLSearchParams(
                                            `_method=delete&authenticity_token=${document
                                                .querySelector(
                                                    'meta[name="csrf-token"]'
                                                )
                                                ?.getAttribute('content')}`
                                        ),
                                    },
                                })
                                .then(({ status }) => {
                                    if (status !== 200) return;
                                    btn.parentElement?.parentElement?.classList.add(
                                        'hide'
                                    );
                                });
                            LSSM.$modal.hide('dialog');
                        },
                    },
                ],
            });
        });
    });
};
